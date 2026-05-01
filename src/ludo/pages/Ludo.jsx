import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { API_BASE_URL } from '../../api';

const Ludo = () => {
    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [gameMode, setGameMode] = useState('CLASSIC');
    const [mode, setMode] = useState(null);
    const { setRoom, setMyPlayer } = useGame();
    const navigate = useNavigate();

    return (
        <div className="container login-wrapper" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '1000px' }}>
            <div className="glass-card login-card" style={{
                width: '450px',
                padding: '3.5rem',
                transform: 'rotateX(5deg) rotateY(-5deg)',
                boxShadow: '20px 20px 60px rgba(0,0,0,0.5), -20px -20px 60px rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                animation: 'floatCard 6s ease-in-out infinite'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div className="logo-3d" style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', textShadow: '0 0 20px var(--primary)' }}>
                        ROYAL LUDO
                    </div>
                    <div style={{ height: '4px', width: '60px', background: 'var(--primary)', margin: '1rem auto', borderRadius: '2px' }}></div>
                </div>

                <div className="login-step" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>Master Name</label>
                        <input
                            className="input-field neon-input"
                            placeholder="Type your name..."
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.2rem', color: '#fff' }}
                        />
                    </div>

                    {!mode ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button className="btn btn-primary premium-btn" onClick={() => setMode('create')}>
                                <span style={{ marginRight: '10px' }}>🏰</span> CREATE KINGDOM
                            </button>
                            <button className="btn join-btn" onClick={() => setMode('join')}>
                                <span style={{ marginRight: '10px' }}>⚔️</span> JOIN BATTLE
                            </button>
                        </div>
                    ) : mode === 'create' ? (
                        <div style={{ animation: 'slideUp 0.3s ease-out' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>STRATEGY</label>
                                    <select className="input-field" value={gameMode} onChange={e => setGameMode(e.target.value)}>
                                        <option value="CLASSIC">Classic 1v1</option>
                                        <option value="2V2">Alliance 2v2</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>WARRIORS</label>
                                    <select className="input-field" value={maxPlayers} onChange={e => setMaxPlayers(e.target.value)} disabled={gameMode === '2V2'}>
                                        <option value={2}>2 Players</option>
                                        <option value={4}>4 Players</option>
                                    </select>
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleCreate(name, maxPlayers, gameMode, setRoom, setMyPlayer, navigate)}>BEGIN CONQUEST</button>
                            <button className="btn" style={{ width: '100%', marginTop: '1rem', background: 'none' }} onClick={() => setMode(null)}>Go Back</button>
                        </div>
                    ) : (
                        <div style={{ animation: 'slideUp 0.3s ease-out' }}>
                            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RECRUITMENT CODE</label>
                            <input
                                className="input-field"
                                placeholder="XXXXXX"
                                value={roomCode}
                                onChange={e => setRoomCode(e.target.value.toUpperCase())}
                                style={{ fontSize: '2rem', textAlign: 'center', letterSpacing: '8px', fontWeight: '900' }}
                            />
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'var(--green)' }} onClick={() => handleJoin(name, roomCode, setRoom, setMyPlayer, navigate)}>ENTRY ARENA</button>
                            <button className="btn" style={{ width: '100%', marginTop: '1rem', background: 'none' }} onClick={() => setMode(null)}>Go Back</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const handleCreate = async (name, maxPlayers, gameMode, setRoom, setMyPlayer, navigate) => {
    if (!name) return alert('Enter name');
    const res = await fetch(`${API_BASE_URL}/api/rooms/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName: name, maxPlayers: parseInt(maxPlayers), gameMode })
    });
    if (!res.ok) {
        const error = await res.text();
        return alert(error);
    }
    const data = await res.json();
    setRoom(data);
    setMyPlayer(data.players[0]);
    navigate(`/lobby/${data.code}`);
};

const handleJoin = async (name, roomCode, setRoom, setMyPlayer, navigate) => {
    if (!name || !roomCode) return alert('Enter name/code');
    const res = await fetch(`${API_BASE_URL}/api/rooms/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: roomCode.toUpperCase(), playerName: name })
    });
    if (!res.ok) {
        const error = await res.text();
        return alert(error);
    }
    const data = await res.json();
    setRoom(data);
    
    // Find player in the room (either just joined or rejoining)
    const player = data.players.find(p => p.name.toLowerCase() === name.toLowerCase());
    setMyPlayer(player);

    if (data.status === 'PLAYING') {
        navigate(`/game/${data.code}`);
    } else {
        navigate(`/lobby/${data.code}`);
    }
};

export default Ludo;
