import { Link } from "react-router-dom";
import ludoBg from "../../assets/ludo-bg.png";

const Home = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(rgba(2,6,23,0.8), rgba(2,6,23,0.9)), url(${ludoBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "2rem",
            }}
        >
            <div
                style={{
                    maxWidth: "700px",
                    textAlign: "center",
                    padding: "3rem 2rem",
                    backdropFilter: "blur(15px)",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                }}
            >
                {/* 🔥 HERO TITLE */}
                <h1
                    style={{
                        fontSize: "3.5rem",
                        fontWeight: "800",
                        marginBottom: "1rem",
                        color: "#fff",
                    }}
                >
                    Ludo  <br />
                    <span
                        style={{
                            background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontStyle: "italic",
                        }}
                    >
                        free unlimited Rooms
                    </span>
                </h1>

                {/* 🔥 SUB TEXT */}
                <p
                    style={{
                        color: "#94a3b8",
                        fontSize: "1.1rem",
                        marginBottom: "2rem",
                    }}
                >
                    No login. No waiting. Just pure fun with friends 🎮
                </p>

                {/* 🔥 FEATURES */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        marginBottom: "2rem",
                        color: "#cbd5f5",
                        fontSize: "0.95rem",
                    }}
                >
                    <p>🚀 Instant Play</p>
                    <p>👤 Enter Name & Start</p>
                    <p>🎮 Multiplayer Rooms</p>
                    <p>♾️ Unlimited Games</p>
                </div>

                {/* ⚠️ SERVER NOTE */}
                <p style={{ color: "orange", fontSize: "0.85rem", marginBottom: "2rem" }}>
                    ⏳ First load may take ~1 min (free server waking up)<br />
                    ⏳ server wake up 1 min after game will smooth and fast
                </p>

                {/* 🔥 BUTTON */}
                <Link
                    to="/ludo"
                    style={{
                        display: "inline-block",
                        padding: "1rem 2.5rem",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        borderRadius: "12px",
                        textDecoration: "none",
                        color: "#fff",
                        background: "linear-gradient(90deg, #2563eb, #3b82f6)",
                        boxShadow: "0 5px 20px rgba(37,99,235,0.5)",
                        transition: "0.3s",
                    }}
                >
                    🎲 Play Now
                </Link>

                {/* 🔥 BOTTOM ICONS */}
                <div
                    style={{
                        marginTop: "2.5rem",
                        display: "flex",
                        justifyContent: "center",
                        gap: "2rem",
                        opacity: 0.7,
                    }}
                >
                    <div>👥 Multiplayer</div>
                    <div>🏆 Ranked</div>
                    <div>💎 Premium</div>
                    <div >
                        Contact me :
                        <a
                            href="https://sravan11.vercel.app/"
                            target="_blank"
                            style={{ color: "#7ecc0aff", }}
                        >
                            click here
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;