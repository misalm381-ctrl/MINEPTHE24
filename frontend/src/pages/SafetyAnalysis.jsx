import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SafetyAnalysis() {
    const navigate = useNavigate();

    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const analyzeSafety = () => {
        if (!text.trim()) {
            setError("Please enter information to analyze.");
            return;
        }

        setError("");

        const lowerText = text.toLowerCase();

        const warningWords = [
            "unsafe",
            "dark",
            "isolated",
            "threat",
            "harassment",
            "abuse",
            "danger",
            "suspicious",
            "private house",
            "unknown person",
            "late night"
        ];

        const detected = warningWords.filter((word) =>
            lowerText.includes(word)
        );

        let status = "Review Recommended";
        let message =
            "The information should be reviewed before approving the collection point.";

        if (detected.length === 0) {
            status = "No Obvious Warning Detected";
            message =
                "No obvious safety warning keyword was detected. Human review is still required.";
        }

        setResult({
            status,
            message,
            detected
        });
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                <div style={styles.header}>
                    <h1>Safety Analysis</h1>

                    <p>
                        MINEPTHE can screen collection-point information
                        for obvious safety warning terms.
                    </p>
                </div>

                <div style={styles.card}>

                    <h2>Information to Analyze</h2>

                    <textarea
                        value={text}
                        onChange={(event) =>
                            setText(event.target.value)
                        }
                        placeholder={
                            "Example:\n" +
                            "Collection point is a public shop near the college."
                        }
                        rows="8"
                        style={styles.textarea}
                    />

                    <button
                        onClick={analyzeSafety}
                        style={styles.primaryButton}
                    >
                        Analyze Safety
                    </button>

                    {error && (
                        <div style={styles.error}>
                            {error}
                        </div>
                    )}

                </div>

                {result && (
                    <div style={styles.card}>

                        <h2>Analysis Result</h2>

                        <div style={styles.status}>
                            {result.status}
                        </div>

                        <p>
                            {result.message}
                        </p>

                        {result.detected.length > 0 ? (
                            <div>
                                <h3>Detected Warning Terms</h3>

                                <div style={styles.warningList}>
                                    {result.detected.map(
                                        (word, index) => (
                                            <span
                                                key={index}
                                                style={styles.warning}
                                            >
                                                {word}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p>
                                No obvious warning terms were detected.
                            </p>
                        )}

                        <div style={styles.notice}>
                            <strong>Important:</strong> This is only a
                            screening tool. It does not determine whether
                            a location is actually safe. Collection points
                            require appropriate human/institutional review.
                        </div>

                    </div>
                )}

                <div style={styles.card}>

                    <h3>MINEPTHE Safety Principle</h3>

                    <p>
                        Safety analysis supports human review. It should
                        not silently approve a collection point or replace
                        responsible review.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/collection-point")
                        }
                        style={styles.secondaryButton}
                    >
                        Collection Point
                    </button>

                </div>

            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        padding: "30px 20px",
        background: "#f5f7fb"
    },

    container: {
        maxWidth: "850px",
        margin: "0 auto"
    },

    header: {
        textAlign: "center",
        marginBottom: "25px"
    },

    card: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "14px",
        marginBottom: "20px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "14px",
        borderRadius: "8px",
        border: "1px solid #cccccc",
        fontSize: "15px",
        resize: "vertical",
        marginTop: "12px",
        marginBottom: "15px"
    },

    primaryButton: {
        width: "100%",
        padding: "14px",
        border: "none",
        borderRadius: "8px",
        background: "#222222",
        color: "#ffffff",
        fontSize: "16px",
        cursor: "pointer"
    },

    secondaryButton: {
        padding: "11px 18px",
        border: "1px solid #bbbbbb",
        borderRadius: "8px",
        background: "#ffffff",
        cursor: "pointer"
    },

    error: {
        marginTop: "15px",
        padding: "12px",
        borderRadius: "8px",
        background: "#ffecec",
        color: "#a00000"
    },

    status: {
        padding: "14px",
        borderRadius: "8px",
        background: "#eeeeee",
        fontWeight: "700",
        marginBottom: "15px"
    },

    warningList: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap"
    },

    warning: {
        padding: "8px 12px",
        borderRadius: "20px",
        background: "#eeeeee"
    },

    notice: {
        marginTop: "20px",
        padding: "14px",
        borderRadius: "8px",
        background: "#fff7df",
        fontSize: "14px"
    }
};

export default SafetyAnalysis;