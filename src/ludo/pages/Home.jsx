import { Link } from 'react-router-dom';
import ludoBg from '../../assets/ludo-bg.png';

const Home = () => {
    return (
        <div className="home-hero" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url(${ludoBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '2rem'
        }}>
            <div className="glass-card" style={{
                maxWidth: '600px',
                textAlign: 'center',
                padding: '4rem 2rem',
                animation: 'fadeIn 1s ease-out'
            }}>
                <h1 className="logo-3d" style={{
                    fontSize: '4rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(to bottom, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '4px'
                }}>
                    ROYAL LUDO
                </h1>
                <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.2rem',
                    marginBottom: '2.5rem',
                    lineHeight: '1.6'
                }}>
                    <div style={{ textAlign: "center", marginTop: "40px" }}>
                        <h1>🎲 Ludo Online</h1>

                        <p>🚀 No Login Required</p>
                        <p>👤 Enter your name and start playing instantly</p>
                        <p>🎮 Create or join a room with friends</p>
                        <p>♾️ Unlimited games, unlimited fun</p>

                        <br />

                        <p style={{ color: "orange" }}>
                            ⏳ First time loading may take up to 1 minute (server starting)
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/ludo" className="btn btn-primary premium-btn" style={{
                        padding: '1.2rem 2.5rem',
                        fontSize: '1.1rem',
                        textDecoration: 'none'
                    }}>
                        Play Now
                    </Link>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', opacity: 0.6 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem' }}>👥</div>
                        <div style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>MULTIPLAYER</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem' }}>🏆</div>
                        <div style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>RANKED</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem' }}>💎</div>
                        <div style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>PREMIUM</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
