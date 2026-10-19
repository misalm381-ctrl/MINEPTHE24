import { useEffect } from "react";

function SplashScreen({ onFinish }) {

    useEffect(() => {

        const timer = setTimeout(() => {
            onFinish();
        }, 1200);

        return () => clearTimeout(timer);

    }, [onFinish]);


    return (

        <div className="minepthe-splash">

            <div className="minepthe-splash-logo">

                <svg
                    viewBox="0 0 160 150"
                    className="minepthe-logo-symbol"
                    aria-label="MINEPTHE"
                >

                    {/* Left book */}
                    <path
                        d="M18 42 L67 68 L67 132 L18 103 Z"
                        fill="#173F35"
                    />

                    {/* Right book */}
                    <path
                        d="M142 42 L93 68 L93 132 L142 103 Z"
                        fill="#173F35"
                    />

                    {/* Center */}
                    <path
                        d="M67 68 L80 76 L93 68 L93 132 L80 141 L67 132 Z"
                        fill="#173F35"
                    />

                    {/* Leaves */}
                    <path
                        d="M80 65 C67 43 48 35 31 34 C48 50 63 59 80 65"
                        fill="#6D9877"
                    />

                    <path
                        d="M80 65 C93 43 112 35 129 34 C112 50 97 59 80 65"
                        fill="#6D9877"
                    />

                    <path
                        d="M80 52 C76 35 78 22 86 12 C91 27 87 41 80 52"
                        fill="#7EA486"
                    />

                </svg>

            </div>

        </div>
    );
}

export default SplashScreen;
