import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { API_BASE_URL } from '../../api';

const COLORS = {
    RED: '#ef4444',
    GREEN: '#22c55e',
    YELLOW: '#eab308',
    BLUE: '#3b82f6'
};

const MASTER_PATH = [
    { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 },
    { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 }, { r: 2, c: 6 }, { r: 1, c: 6 }, { r: 0, c: 6 },
    { r: 0, c: 7 }, { r: 0, c: 8 },
    { r: 1, c: 8 }, { r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 },
    { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 }, { r: 6, c: 13 }, { r: 6, c: 14 },
    { r: 7, c: 14 }, { r: 8, c: 14 },
    { r: 8, c: 13 }, { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }, { r: 8, c: 9 },
    { r: 9, c: 8 }, { r: 10, c: 8 }, { r: 11, c: 8 }, { r: 12, c: 8 }, { r: 13, c: 8 }, { r: 14, c: 8 },
    { r: 14, c: 7 }, { r: 14, c: 6 },
    { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 },
    { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 }, { r: 8, c: 0 },
    { r: 7, c: 0 }, { r: 6, c: 0 }
];

const HOME_PATHS = {
    GREEN: [{ r: 7, c: 1 }, { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 }, { r: 7, c: 6 }],
    YELLOW: [{ r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 }, { r: 6, c: 7 }],
    BLUE: [{ r: 7, c: 13 }, { r: 7, c: 12 }, { r: 7, c: 11 }, { r: 7, c: 10 }, { r: 7, c: 9 }, { r: 7, c: 8 }],
    RED: [{ r: 13, c: 7 }, { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }, { r: 9, c: 7 }, { r: 8, c: 7 }]
};

const BASE_HOLES = {
    GREEN: [{ r: 1.91, c: 1.91 }, { r: 1.91, c: 4.09 }, { r: 4.09, c: 1.91 }, { r: 4.09, c: 4.09 }],
    YELLOW: [{ r: 1.91, c: 10.91 }, { r: 1.91, c: 13.09 }, { r: 4.09, c: 10.91 }, { r: 4.09, c: 13.09 }],
    RED: [{ r: 10.91, c: 1.91 }, { r: 10.91, c: 4.09 }, { r: 13.09, c: 1.91 }, { r: 13.09, c: 4.09 }],
    BLUE: [{ r: 10.91, c: 10.91 }, { r: 10.91, c: 13.09 }, { r: 13.09, c: 10.91 }, { r: 13.09, c: 13.09 }]
};

const COLOR_OFFSETS = {
    GREEN: 0,
    YELLOW: 13,
    BLUE: 26,
    RED: 39
};

const SAFE_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];
const START_CELLS = {
    GREEN: { r: 7, c: 0, arrow: 'right' },
    YELLOW: { r: 0, c: 7, arrow: 'down' },
    BLUE: { r: 7, c: 14, arrow: 'left' },
    RED: { r: 14, c: 7, arrow: 'up' }
};

const ENTRY_CELLS = Object.fromEntries(
    Object.entries(COLOR_OFFSETS).map(([color, offset]) => [color, MASTER_PATH[offset]])
);

const GameBoardPage = () => {
    const { roomCode } = useParams();
    const { gameState, setGameState, room, setRoom, myPlayer, setMyPlayer, rollDice, sendMove, connect } = useGame();

    const [localRolling, setLocalRolling] = useState(false);
    const [displayTime, setDisplayTime] = useState(60);

    useEffect(() => {
        if (roomCode) connect(roomCode);
    }, [roomCode, connect]);

    useEffect(() => {
        if (!roomCode || gameState?.roomCode === roomCode) return;

        fetch(`${API_BASE_URL}/api/rooms/${roomCode}`)
            .then(res => res.json())
            .then(data => {
                setRoom(data);
                const savedPlayer = JSON.parse(localStorage.getItem('ludo_player'));
                if (savedPlayer) {
                    const roomPlayer = data.players.find(p => p.name === savedPlayer.name);
                    if (roomPlayer) {
                        setMyPlayer(roomPlayer);
                    }
                }
                if (data.gameState) {
                    setGameState(JSON.parse(data.gameState));
                }
            })
            .catch(error => console.error('Failed to load game state', error));
    }, [roomCode, gameState?.roomCode, setGameState, setRoom, setMyPlayer]);

    useEffect(() => {
        if (gameState?.diceRolled && gameState?.rollId) {
            setLocalRolling(true);
            const timer = setTimeout(() => setLocalRolling(false), 600);
            return () => clearTimeout(timer);
        } else {
            setLocalRolling(false);
        }
    }, [gameState?.rollId]);

    useEffect(() => {
        if (!gameState?.turnStartTime || gameState.status !== 'PLAYING') return;

        const updateTimer = () => {
            const elapsed = Math.floor((Date.now() - gameState.turnStartTime) / 1000);
            setDisplayTime(Math.max(0, 60 - elapsed));
        };

        updateTimer();
        const interval = setInterval(updateTimer, 500); // 500ms for responsiveness
        return () => clearInterval(interval);
    }, [gameState?.turnStartTime, gameState?.status, gameState?.currentTurnColor]);

    useEffect(() => {
        setLocalRolling(false);
    }, [gameState?.currentTurnColor]);

    if (!gameState) {
        return (
            <div className="container loading-state">
                <div className="logo-3d">INITIALIZING ARENA</div>
                <div className="glass-card">Synchronizing game state with server...</div>
            </div>
        );
    }

    const isMyTurn = gameState.currentTurnColor === myPlayer?.color;
    const playableColors = Object.keys(gameState.players || {}).filter(color => COLORS[color]);

    // Calculate dynamic offsets for tokens
    const tokenOffsets = {};
    const cellGroups = {};

    playableColors.forEach(color => {
        gameState.players[color].tokens.forEach(token => {
            if (token.position === -1) return;
            const pos = getTokenCell(token, color);
            const key = `${pos.r}-${pos.c}`;
            if (!cellGroups[key]) cellGroups[key] = [];
            cellGroups[key].push({ color, id: token.id });
        });
    });

    Object.values(cellGroups).forEach(tokens => {
        if (tokens.length === 1) {
            tokenOffsets[`${tokens[0].color}-${tokens[0].id}`] = { x: 0, y: 0 };
        } else {
            tokens.forEach((t, i) => {
                const angle = (i / tokens.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 0.22;
                tokenOffsets[`${t.color}-${t.id}`] = {
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius
                };
            });
        }
    });

    return (
        <div className="container ludo-container">
            <section className="game-panel">
                <div className="turn-indicator-box">
                    <h2 style={{ color: COLORS[gameState.currentTurnColor] || '#fff' }}>
                        {gameState.status === 'FINISHED' ? `👑 ${gameState.winnerColor} VICTORIOUS` : `${gameState.currentTurnColor}'S TURN`}
                    </h2>
                    <p className="game-msg">{gameState.message || 'The battle continues...'}</p>
                </div>

                <div className="dice-section">
                    {isMyTurn && !gameState.diceRolled && <div className="your-turn-badge">YOUR TURN</div>}
                    <div className="timer-ring" style={{ '--remaining': `${(displayTime / 60) * 100}%` }}>
                        <span className="timer-text">{displayTime}s</span>
                    </div>

                    <div
                        key={`dice-${gameState.turnSequence}`}
                        className={`dice-container ${(!isMyTurn || gameState.diceRolled || gameState.status === 'FINISHED') ? 'disabled' : ''}`}
                        onClick={() => isMyTurn && !gameState.diceRolled && gameState.status !== 'FINISHED' && rollDice(myPlayer.id)}
                    >
                        <div className={`dice-cube ${localRolling ? 'rolling' : ''}`} data-side={gameState.lastDiceValue || 1}>
                            <div className="face front side-1"><div className="dot"></div></div>
                            <div className="face back side-2"><div className="dot"></div><div className="dot"></div></div>
                            <div className="face right side-3"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
                            <div className="face left side-4"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
                            <div className="face top side-5"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
                            <div className="face bottom side-6"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="ludo-layout-wrapper">
                {playableColors.map(color => (
                    <PlayerCard
                        key={color}
                        player={gameState.players[color]}
                        color={color}
                        isCurrentTurn={gameState.currentTurnColor === color}
                        isMyPlayer={myPlayer?.color === color}
                    />
                ))}

                <section className="ludo-board-wrapper" aria-label="Ludo board">
                    <div className="board-grid">
                        {Array.from({ length: 225 }).map((_, i) => {
                            const r = Math.floor(i / 15);
                            const c = i % 15;
                            return <Cell key={i} row={r} col={c} />;
                        })}
                    </div>

                    {Object.keys(BASE_HOLES).map(color => (
                        <div key={color} className={`base-panel base-panel-${color.toLowerCase()}`} aria-hidden="true" />
                    ))}

                    {Object.entries(BASE_HOLES).flatMap(([color, holes]) =>
                        holes.map((hole, index) => (
                            <span
                                key={`${color}-home-dot-${index}`}
                                className="home-dot"
                                style={{
                                    top: `${(hole.r / 15) * 100}%`,
                                    left: `${(hole.c / 15) * 100}%`,
                                    '--dot-color': COLORS[color]
                                }}
                                aria-hidden="true"
                            />
                        ))
                    )}

                    <div className="center-home" aria-hidden="true">
                        <span className="center-triangle yellow" />
                        <span className="center-triangle green" />
                        <span className="center-triangle red" />
                        <span className="center-triangle blue" />
                    </div>

                    {playableColors.flatMap(color =>
                        gameState.players[color].tokens.map(token => (
                            <Token
                                key={`${color}-${token.id}`}
                                token={token}
                                color={color}
                                offset={tokenOffsets[`${color}-${token.id}`] || { x: 0, y: 0 }}
                                isClickable={isMyTurn && gameState.diceRolled && color === myPlayer?.color && gameState.status !== 'FINISHED'}
                                onClick={() => sendMove(myPlayer.id, token.id)}
                            />
                        ))
                    )}
                </section>
            </div>
        </div>
    );
};

const PlayerCard = ({ player, color, isCurrentTurn, isMyPlayer }) => (
    <div className={`player-card player-card-${color.toLowerCase()} ${isCurrentTurn ? 'active-turn' : ''} ${isMyPlayer ? 'is-me' : ''}`}>
        <div className="player-avatar" style={{ '--player-color': COLORS[color] }}>
            {isCurrentTurn && <div className="turn-pulse" />}
            <span className="avatar-icon">👑</span>
        </div>
        <div className="player-info">
            <span className="player-name">{player?.name || 'Waiting...'}</span>
            <div className="player-meta">
                <span className="player-coins">💰 {player?.coins || 0}</span>
                {isCurrentTurn && <span className="turn-label">DICE READY</span>}
            </div>
        </div>
    </div>
);

const Cell = ({ row, col }) => {
    const color = getCellColor(row, col);
    const arrow = Object.entries(START_CELLS).find(([, cell]) => cell.r === row && cell.c === col);
    const entry = Object.values(ENTRY_CELLS).some(cell => cell.r === row && cell.c === col);
    const isSafe = SAFE_INDICES.some(index => MASTER_PATH[index].r === row && MASTER_PATH[index].c === col);

    return (
        <div className={`board-cell ${color ? `cell-${color.toLowerCase()}` : ''} ${isTrackCell(row, col) ? 'track-cell' : ''}`}>
            {isSafe && <span className={`safe-star ${entry ? 'start-star' : ''}`}>★</span>}
            {arrow && <span className={`start-arrow ${arrow[1].arrow}`} style={{ '--arrow-color': COLORS[arrow[0]] }} />}
        </div>
    );
};

const Token = ({ token, color, isClickable, onClick, offset }) => {
    const pos = getTokenCell(token, color);

    // If token is at base (-1), use hole position directly.
    // Otherwise use cell center + dynamic offset.
    const top = token.position === -1
        ? `${(pos.r / 15) * 100}%`
        : `${((pos.r + 0.5 + offset.y) / 15) * 100}%`;
    const left = token.position === -1
        ? `${(pos.c / 15) * 100}%`
        : `${((pos.c + 0.5 + offset.x) / 15) * 100}%`;

    return (
        <button
            type="button"
            className={`token token-${color.toLowerCase()} ${token.position === -1 ? 'home-token' : ''} ${isClickable ? 'playable' : ''}`}
            style={{
                top,
                left,
                '--token-color': COLORS[color]
            }}
            onClick={isClickable ? onClick : undefined}
            aria-label={`${color} token ${token.id + 1}`}
            disabled={!isClickable}
        />
    );
};

const getTokenCell = (token, color) => {
    if (token.position === -1) return BASE_HOLES[color][token.id];
    if (token.position >= 52) return HOME_PATHS[color][Math.min(token.position - 52, 5)];

    const offset = COLOR_OFFSETS[color] || 0;
    return MASTER_PATH[(token.position + offset) % MASTER_PATH.length];
};

const isTrackCell = (r, c) => MASTER_PATH.some(cell => cell.r === r && cell.c === c);

const getCellColor = (r, c) => {
    if (Object.values(START_CELLS).some(cell => cell.r === r && cell.c === c)) return null;

    const entryColor = Object.entries(ENTRY_CELLS).find(([, cell]) => cell.r === r && cell.c === c)?.[0];
    if (entryColor) return entryColor;

    if (r < 6 && c < 6) return 'GREEN';
    if (r < 6 && c > 8) return 'YELLOW';
    if (r > 8 && c < 6) return 'RED';
    if (r > 8 && c > 8) return 'BLUE';
    if (r === 7 && c > 0 && c < 7) return 'GREEN';
    if (c === 7 && r > 0 && r < 7) return 'YELLOW';
    if (r === 7 && c > 7 && c < 14) return 'BLUE';
    if (c === 7 && r > 7 && r < 14) return 'RED';

    return null;
};

export default GameBoardPage;
