import { useNavigate } from "react-router-dom";

function Messages() {
    const navigate = useNavigate();

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                <div style={styles.header}>
                    <button
                        onClick={() => navigate(-1)}
                        style={styles.backButton}
                    >
                        ← Back
                    </button>

                    <h1>Messages</h1>

                    <p>
                        Communication related to your MINEPTHE
                        book requests.
                    </p>
                </div>

                <div style={styles.card}>

                    <h2>Message Center</h2>

                    <div style={styles.notice}>
                        <h3>Safety Reminder</h3>

                        <p>
                            Do not share personal information such
                            as your phone number, home address,
                            passwords, or other private details.
                        </p>

                        <p>
                            Use the approved MINEPTHE collection
                            process when arranging book collection.
                        </p>
                    </div>

                    <div style={styles.empty}>
                        <h3>No Messages Yet</h3>

                        <p>
                            Your book-related messages will appear
                            here when communication is required.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={styles.primaryButton}
                    >
                        Go to Dashboard
                    </button>

                </div>

            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px 20px"
    },

    container: {
        maxWidth: "900px",
        margin: "0 auto"
    },

    header: {
        marginBottom: "20px"
    },

    backButton: {
        padding: "9px 15px",
        border: "1px solid #ccc",
        borderRadius: "7px",
        background: "#ffffff",
        cursor: "pointer",
        marginBottom: "20px"
    },

    card: {
        background: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    },

    notice: {
        marginTop: "20px",
        padding: "20px",
        background: "#fff8e8",
        border: "1px solid #ead9a8",
        borderRadius: "10px"
    },

    empty: {
        marginTop: "20px",
        marginBottom: "25px",
        padding: "20px",
        background: "#f8f9fb",
        borderRadius: "10px"
    },

    primaryButton: {
        padding: "11px 18px",
        border: "none",
        borderRadius: "8px",
        background: "#222",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "600"
    }
};

export default Messages;