import React from "react";

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <p style={styles.text}>
                © {new Date().getFullYear()} K. Sravan Kumar
            </p>
        </footer>
    );
};

const styles = {
    footer: {
        width: "100%",
        padding: "15px 0",
        textAlign: "center",
        backgroundColor: "#111",
        color: "#fff",
        position: "fixed",
        bottom: 0,
        left: 0,
    },
    text: {
        margin: 0,
        fontSize: "14px",
        letterSpacing: "0.5px",
    },
};

export default Footer;