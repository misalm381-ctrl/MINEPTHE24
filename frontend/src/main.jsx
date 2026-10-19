import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";

function SplashScreen({ onFinish }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 1200);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="minepthe-splash">

            <img
                src="/minepthe-symbol.png"
                alt="MINEPTHE Logo"
                className="minepthe-splash-logo"
            />

            <h1>MINEPTHE</h1>

            <p className="minepthe-motto">
                Give · Find · Grow
            </p>

        </div>
    );
}

function Root() {
    const [showSplash, setShowSplash] = useState(true);

    return showSplash ? (
        <SplashScreen
            onFinish={() => setShowSplash(false)}
        />
    ) : (
        <App />
    );
}

createRoot(
    document.getElementById("root")
).render(
    <StrictMode>
        <Root />
    </StrictMode>
);