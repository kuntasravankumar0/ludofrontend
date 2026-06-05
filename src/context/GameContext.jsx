import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_BASE_URL } from '../api';

const GameContext = createContext();
const PLAYER_STORAGE_KEY = 'ludo_player';

const readSavedPlayer = () => {
    try {
        const saved = sessionStorage.getItem(PLAYER_STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        sessionStorage.removeItem(PLAYER_STORAGE_KEY);
        return null;
    }
};

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState(null);
    const [room, setRoom] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
    
    const [myPlayer, setMyPlayer] = useState(readSavedPlayer);

    const clientRef = useRef(null);
    const roomCodeRef = useRef(null);
    const connectingRef = useRef(false);
    const statusRef = useRef('DISCONNECTED');

    const updateStatus = (status) => {
        statusRef.current = status;
        setConnectionStatus(status);
    };

    useEffect(() => {
        if (myPlayer) {
            sessionStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(myPlayer));
        }
    }, [myPlayer]);

    const syncMyPlayerWithRoom = useCallback((roomData) => {
        if (!roomData?.players) return;
        const saved = readSavedPlayer();
        if (saved) {
            const rp = roomData.players.find(p => p.name.toLowerCase() === saved.name.toLowerCase());
            if (rp) {
                setMyPlayer(rp);
            }
        }
    }, []);

    const connect = useCallback((roomCode) => {
        if (!roomCode) return;
        
        const isNewRoom = roomCodeRef.current !== roomCode;
        roomCodeRef.current = roomCode;
        
        if (!isNewRoom && (clientRef.current?.active || connectingRef.current)) {
            return;
        }

        connectingRef.current = true;
        updateStatus('CONNECTING');

        if (clientRef.current) {
            clientRef.current.deactivate();
        }

        try {
            const client = new Client({
                webSocketFactory: () => {
                    const httpUrl = WS_BASE_URL.replace(/^ws/, 'http');
                    return new SockJS(`${httpUrl}/ws-ludo`);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 10000,
                heartbeatOutgoing: 10000,
            });

            client.onConnect = () => {
                connectingRef.current = false;
                roomCodeRef.current = roomCode;
                updateStatus('CONNECTED');
                
                client.subscribe(`/topic/game/${roomCode}`, (message) => {
                    const data = JSON.parse(message.body);
                    setGameState(data);
                });

                client.subscribe(`/topic/room/${roomCode}`, (message) => {
                    const data = JSON.parse(message.body);
                    setRoom(data);
                    syncMyPlayerWithRoom(data);
                });
            };

            client.onStompError = (frame) => {
                console.error('[LUDO-WS] STOMP error:', frame.headers['message']);
                connectingRef.current = false;
                updateStatus('ERROR');
            };

            client.onWebSocketClose = () => {
                console.warn('[LUDO-WS] WebSocket closed');
                connectingRef.current = false;
                updateStatus('CLOSED');
            };

            client.activate();
            clientRef.current = client;
        } catch (err) {
            console.error('[LUDO-WS] Exception during connection setup:', err);
            connectingRef.current = false;
            updateStatus('FAILED');
        }

        // Safety watchdog
        setTimeout(() => {
            if (connectingRef.current && statusRef.current === 'CONNECTING') {
                console.error('[LUDO-WS] WATCHDOG: Connection still pending after 10s, resetting.');
                connectingRef.current = false;
                updateStatus('TIMEOUT');
            }
        }, 10000);
    }, [syncMyPlayerWithRoom]);

    const rollDice = (playerId) => {
        const roomCode = roomCodeRef.current;
        const client = clientRef.current;
        if (!roomCode) {
            console.error('[LUDO-WS] Cannot roll dice: roomCode is not set.');
            return;
        }
        if (client?.connected) {
            client.publish({
                destination: `/app/game/${roomCode}/roll`,
                body: JSON.stringify({ playerId })
            });
        } else {
            console.error('[LUDO-WS] Cannot roll dice: WebSocket is not connected.');
        }
    };

    const sendMove = (playerId, tokenId) => {
        const roomCode = roomCodeRef.current;
        const client = clientRef.current;
        if (!roomCode) {
            console.error('[LUDO-WS] Cannot send move: roomCode is not set.');
            return;
        }
        if (client?.connected) {
            client.publish({
                destination: `/app/game/${roomCode}/move`,
                body: JSON.stringify({ playerId, tokenId })
            });
        } else {
            console.error('[LUDO-WS] Cannot send move: WebSocket is not connected.');
        }
    };

    return (
        <GameContext.Provider value={{
            gameState, setGameState,
            room, setRoom,
            myPlayer, setMyPlayer,
            rollDice, sendMove,
            connect, connectionStatus
        }}>
            {children}
        </GameContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => useContext(GameContext);
