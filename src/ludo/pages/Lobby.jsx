import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { API_BASE_URL } from '../../api';

const Lobby = () => {
    const { roomCode } = useParams();
    const { room, setRoom, myPlayer, setMyPlayer, connect, gameState, connectionStatus } = useGame();
    const navigate = useNavigate();

    const fetchRoom = useCallback(() => {
        if (!roomCode) return;
        fetch(`${API_BASE_URL}/api/rooms/${roomCode}`)
            .then(res => {
                if (!res.ok) throw new Error('Room not found');
                return res.json();
            })
            .then(data => {
                setRoom(data);
                
                const saved = JSON.parse(sessionStorage.getItem('ludo_player'));
                if (saved) {
                    const rp = data.players.find(p => p.name.toLowerCase() === saved.name.toLowerCase());
                    if (rp) {
                        setMyPlayer(rp);
                    }
                }

                if (data.status === 'PLAYING' && data.gameState) {
                    navigate(`/game/${roomCode}`);
                }
            })
            .catch(err => {
                console.error("[LOBBY] Fetch error", err);
                navigate('/ludo');
            });
    }, [roomCode, setRoom, setMyPlayer, navigate]);

    useEffect(() => {
        if (!roomCode) return;
        connect(roomCode);
        
        // Initial fetch if room is null
        if (!room) {
            fetchRoom();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomCode, connect, fetchRoom]);

    useEffect(() => {
        if ((gameState && gameState.status === 'PLAYING') || (room && room.status === 'PLAYING')) {
            navigate(`/game/${roomCode}`);
        }
    }, [gameState, room, navigate, roomCode]);

    const handleStart = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/rooms/${roomCode}/start`, { method: 'POST' });
            if (!res.ok) {
                const err = await res.text();
                alert(err || 'Failed to start game');
                return;
            }

            const data = await res.json();
            if (data.gameState || data.status === 'PLAYING') {
                navigate(`/game/${roomCode}`);
            } else {
                fetchRoom();
            }
        } catch (error) {
            console.error('Start error', error);
            alert('Network error while starting game');
        }
    };

    if (!room) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <div className="logo-3d" style={{ fontSize: '2rem' }}>Loading Kingdom...</div>
        </div>
    );

    // Reliable host check: the first player in the room's list is the host.
    // Use optional chaining and fallback to empty string for safe comparison.
    const hostPlayer = room.players && room.players.length > 0 ? room.players[0] : null;
    const isHost = hostPlayer && myPlayer && hostPlayer.name.toLowerCase() === myPlayer.name.toLowerCase();

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <div className="glass-card" style={{ padding: '3rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: connectionStatus === 'CONNECTED' ? '#22c55e' : '#ef4444' }}>
                        ● {connectionStatus}
                    </span>
                    <button 
                        onClick={fetchRoom}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '1.2rem' }}
                        title="Refresh Lobby"
                    >
                        {"\uD83D\uDD04"}
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Kingdom: {roomCode}</h2>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0' }}>Assemble your warriors</p>
                    </div>
                    <div style={{ padding: '1rem 1.5rem', background: 'rgba(59,130,246,0.1)', border: '1px solid var(--primary)', borderRadius: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{room.players.length} / {room.maxPlayers}</div>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Warriors</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {room.players.map((p, i) => (
                        <div key={i} className="glass-card" style={{ 
                            padding: '2rem', 
                            textAlign: 'center', 
                            border: `1px solid rgba(255,255,255,0.05)`,
                            borderBottom: `4px solid ${p.color.toLowerCase()}`,
                            background: 'rgba(255,255,255,0.02)',
                            transition: '0.3s'
                        }}>
                            <div style={{ 
                                width: '70px', 
                                height: '70px', 
                                background: p.color.toLowerCase(), 
                                borderRadius: '50%', 
                                margin: '0 auto 1.5rem',
                                boxShadow: `0 0 20px ${p.color.toLowerCase()}44`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem'
                            }}>
                                {"\uD83D\uDEE1"}
                            </div>
                            <strong style={{ fontSize: '1.2rem', display: 'block' }}>{p.name} {i === 0 && <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>(KING)</span>}</strong>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>House of {p.color}</p>
                            <div style={{ marginTop: '1rem', color: '#ffd700', fontWeight: 'bold', fontSize: '1.1rem' }}>{"\uD83D\uDCB0"} {p.user?.coins || 0}</div>
                        </div>
                    ))}
                </div>

                {isHost ? (
                    <button 
                        className="btn btn-primary premium-btn" 
                        style={{ width: '100%', padding: '1.5rem', fontSize: '1.4rem' }}
                        disabled={room.players.length < 2}
                        onClick={handleStart}
                    >
                        {"\uD83D\uDE80"} BEGIN BATTLE
                    </button>
                ) : (
                    <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }}>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Waiting for the King to sound the horn...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lobby;
