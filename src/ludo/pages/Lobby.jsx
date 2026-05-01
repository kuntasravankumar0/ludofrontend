import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { API_BASE_URL } from '../../api';

const Lobby = () => {
    const { roomCode } = useParams();
    const { room, setRoom, myPlayer, connect, gameState } = useGame();
    const navigate = useNavigate();

    useEffect(() => {
        connect(roomCode);
    }, [roomCode, connect]);

    useEffect(() => {
        if (!room) {
            fetch(`${API_BASE_URL}/api/rooms/${roomCode}`)
                .then(res => res.json())
                .then(data => setRoom(data));
        }
    }, [roomCode, room, setRoom]);

    useEffect(() => {
        if (gameState && gameState.status === 'PLAYING') {
            navigate(`/game/${roomCode}`);
        }
    }, [gameState, navigate, roomCode]);

    const handleStart = async () => {
        await fetch(`${API_BASE_URL}/api/rooms/${roomCode}/start`, { method: 'POST' });
    };

    if (!room) return <div className="container">Loading room...</div>;

    return (
        <div className="container">
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>Room: {roomCode}</h2>
                    <div style={{ padding: '0.5rem 1rem', background: 'var(--primary)', borderRadius: '0.5rem' }}>
                        {room.players.length} / {room.maxPlayers} Players
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {room.players.map((p, i) => (
                        <div key={i} className="glass-card" style={{ padding: '1rem', textAlign: 'center', border: `2px solid ${p.color.toLowerCase()}` }}>
                            <div style={{ width: '50px', height: '50px', background: p.color.toLowerCase(), borderRadius: '50%', margin: '0 auto 10px' }}></div>
                            <strong>{p.name}</strong>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.color}</p>
                            <div style={{ marginTop: '5px', color: '#ffd700', fontWeight: 'bold' }}>💰 {p.user?.coins || 0}</div>
                        </div>
                    ))}
                </div>

                {room.players[0].name === myPlayer?.name && (
                    <button 
                        className="btn btn-primary" 
                        style={{ width: '100%', fontSize: '1.2rem' }}
                        disabled={room.players.length < 2}
                        onClick={handleStart}
                    >
                        Start Game
                    </button>
                )}
                
                {room.players[0].name !== myPlayer?.name && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Waiting for host to start...</p>
                )}
            </div>
        </div>
    );
};

export default Lobby;
