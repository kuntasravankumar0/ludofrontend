import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { API_BASE_URL, WS_BASE_URL } from '../api';

const GameContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [room, setRoom] = useState(null);
    const [myPlayer, setMyPlayer] = useState(() => {
        const saved = localStorage.getItem('ludo_player');
        return saved ? JSON.parse(saved) : null;
    });
    
    useEffect(() => {
        if (myPlayer) {
            localStorage.setItem('ludo_player', JSON.stringify(myPlayer));
        }
    }, [myPlayer]);

    const clientRef = useRef(null);
    const roomCodeRef = useRef(null);

    const connect = useCallback((roomCode) => {
        if (clientRef.current?.connected && roomCodeRef.current === roomCode) {
            return;
        }

        if (clientRef.current) {
            clientRef.current.deactivate();
        }

        const client = new Client({
            webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws-ludo`),
            onConnect: () => {
                console.log('Connected to WebSocket');
                roomCodeRef.current = roomCode;
                client.subscribe(`/topic/game/${roomCode}`, (message) => {
                    setGameState(JSON.parse(message.body));
                });
                client.subscribe(`/topic/room/${roomCode}`, (message) => {
                    setRoom(JSON.parse(message.body));
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error', frame);
            },
        });

        client.activate();
        clientRef.current = client;
        setStompClient(client);
    }, []);

    const sendMove = (playerId, tokenId) => {
        const code = room?.code || gameState?.roomCode;
        const client = clientRef.current || stompClient;

        if (code && client?.connected) {
            client.publish({
                destination: `/app/game/${code}/move`,
                body: JSON.stringify({ playerId, tokenId }),
            });
        }
    };

    const rollDice = (playerId) => {
        const code = room?.code || gameState?.roomCode;
        const client = clientRef.current || stompClient;

        if (code && client?.connected) {
            client.publish({
                destination: `/app/game/${code}/roll`,
                body: JSON.stringify({ playerId }),
            });
        }
    };


    useEffect(() => () => {
        clientRef.current?.deactivate();
    }, []);

    return (
        <GameContext.Provider value={{
            gameState, setGameState,
            room, setRoom,
            myPlayer, setMyPlayer,
            connect, sendMove, rollDice
        }}>
            {children}
        </GameContext.Provider>
    );
};
