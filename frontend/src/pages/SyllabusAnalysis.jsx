import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeSyllabus } from "../services/api";

function SyllabusAnalysis() {
    const navigate = useNavigate();

    const [syllabusText, setSyllabusText] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const analyze = async () => {
        if (!syllabusText.trim()) {
            setError("Please enter or paste your syllabus.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await analyzeSyllabus(syllabusText);

            if (response && response.success) {
                setResult(response.syllabus);

                localStorage.setItem(
                    "analyzedSyllabus",
                    JSON.stringify(response.syllabus)
                );
            } else {
                setError(
                    response.message ||
                    "Unable to analyze the syllabus."
                );
            }
        } catch (err) {
            setError(
                err.message ||
                "Syllabus analysis failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                <div style={styles.header}>
                    <h1>Syllabus Understanding</h1>

                    <p>
                        MINEPTHE analyzes your syllabus and identifies
                        academic subjects and important topics.
                    </p>
                </div>

                <div style={styles.card}>

                    <h2>Enter Syllabus</h2>

                    <textarea
                        value={syllabusText}
                        onChange={(event) =>
                            setSyllabusText(event.target.value)
                        }
                        placeholder={
                            "Paste your syllabus here...\n\n" +
                            "Example:\n" +
                            "Data Structures\n" +
                            "Database Management Systems\n" +
                            "Operating Systems\n" +
                            "Computer Networks"
                        }
                        rows="12"
                        style={styles.textarea}
                    />

                    <button
                        onClick={analyze}
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading
                            ? "Analyzing..."
                            : "Analyze Syllabus"}
                    </button>

                    {error && (
                        <div style={styles.error}>
                            {error}
                        </div>
                    )}

                </div>

                {result && (
                    <div style={styles.card}>

                        <h2>Detected Academic Information</h2>

                        <div style={styles.info}>
                            <strong>Course</strong>

                            <span>
                                {result.course || "Not detected"}
                            </span>
                        </div>

                        <div style={styles.info}>
                            <strong>Department</strong>

                            <span>
                                {result.department || "Not detected"}
                            </span>
                        </div>

                        <div style={styles.info}>
                            <strong>Year</strong>

                            <span>
                                {result.year || "Not detected"}
                            </span>
                        </div>

                        <h3>Subjects</h3>

                        {result.subjects &&
                        result.subjects.length > 0 ? (
                            <div style={styles.list}>
                                {result.subjects.map(
                                    (subject, index) => (
                                        <div
                                            key={index}
                                            style={styles.item}
                                        >
                                            {subject}
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <p>No subjects detected.</p>
                        )}

                        <h3>Important Topics</h3>

                        {result.keywords &&
                        result.keywords.length > 0 ? (
                            <div style={styles.list}>
                                {result.keywords.map(
                                    (keyword, index) => (
                                        <div
                                            key={index}
                                            style={styles.item}
                                        >
                                            {keyword}
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <p>No specific topics detected.</p>
                        )}

                        <div style={styles.notice}>
                            These subjects and topics can later be
                            used by MINEPTHE to find relevant
                            available books.
                        </div>

                        <div style={styles.buttonRow}>

                            <button
                                onClick={() => navigate("/books")}
                                style={styles.secondaryButton}
                            >
                                Browse Books
                            </button>

                            <button
                                onClick={() => navigate("/dashboard")}
                                style={styles.secondaryButton}
                            >
                                Dashboard
                            </button>

                        </div>

                    </div>
                )}

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
        resize: "vertical",
        fontSize: "15px",
        marginTop: "12px",
        marginBottom: "15px"
    },

    button: {
        width: "100%",
        padding: "14px",
        border: "none",
        borderRadius: "8px",
        background: "#222222",
        color: "#ffffff",
        fontSize: "16px",
        cursor: "pointer"
    },

    info: {
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
        padding: "10px 0",
        borderBottom: "1px solid #eeeeee"
    },

    list: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    item: {
        padding: "10px",
        borderRadius: "8px",
        background: "#f3f4f6"
    },

    notice: {
        marginTop: "20px",
        padding: "14px",
        borderRadius: "8px",
        background: "#eef5ff"
    },

    error: {
        marginTop: "15px",
        padding: "12px",
        borderRadius: "8px",
        background: "#ffecec",
        color: "#a00000"
    },

    buttonRow: {
        display: "flex",
        gap: "12px",
        marginTop: "20px",
        flexWrap: "wrap"
    },

    secondaryButton: {
        padding: "12px 20px",
        border: "1px solid #bbbbbb",
        borderRadius: "8px",
        background: "#ffffff",
        cursor: "pointer"
    }
};

export default SyllabusAnalysis;