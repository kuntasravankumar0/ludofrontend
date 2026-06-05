import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import ludoBg from "../../assets/ludo-bg.png";
import "./Home.css";

const Home = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let app;

        const init = async () => {
            const { default: LiquidBackground } = await import(
                "https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js"
            );

            app = LiquidBackground(canvasRef.current);

            app.loadImage(ludoBg);

            app.liquidPlane.material.metalness = 0.75;
            app.liquidPlane.material.roughness = 0.25;
            app.liquidPlane.uniforms.displacementScale.value = 5;

            app.setRain(false);
        };

        init();

        return () => {
            if (app?.dispose) app.dispose();
        };
    }, []);

    return (
        <div className="home">
            <canvas ref={canvasRef} id="liquid-canvas" />

            <div className="dice dice1">🎲</div>
            <div className="dice dice2">🎲</div>
            <div className="dice dice3">🎲</div>

            <div className="hero-card">
                <div className="badge">
                    🚀 Ultimate Multiplayer Experience
                </div>

                <h1 className="hero-title">
                    Ludo King
                    <span>Unlimited Rooms</span>
                </h1>

                <p className="hero-desc">
                    Create rooms instantly, play with friends,
                    compete in ranked matches and enjoy smooth
                    multiplayer gameplay.
                </p>

                <div className="stats">
                    <div>
                        <h2>10K+</h2>
                        <p>Players</p>
                    </div>

                    <div>
                        <h2>500+</h2>
                        <p>Rooms Daily</p>
                    </div>

                    <div>
                        <h2>99%</h2>
                        <p>Uptime</p>
                    </div>
                </div>

                <div className="features">
                    <div className="feature">🚀 Instant Play</div>
                    <div className="feature">🎮 Multiplayer</div>
                    <div className="feature">🏆 Ranked Matches</div>
                    <div className="feature">⚡ Fast Gameplay</div>
                    <div className="feature">👤 No Login</div>
                    <div className="feature">♾️ Unlimited Rooms</div>
                </div>

                <div className="warning">
                    ⏳ Free server may take up to 1 minute to wake up.
                </div>

                <Link to="/ludo" className="play-btn">
                    🎮 Play Now
                </Link>

                <div className="footer">
                    <span>👥 Multiplayer</span>
                    <span>🏆 Ranked</span>
                    <span>💎 Premium</span>

                    <a
                        href="https://sravan11111.vercel.app/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Portfolio
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Home;