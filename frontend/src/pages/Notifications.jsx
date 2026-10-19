import { useNavigate } from "react-router-dom";

function Notifications() {
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

                    <h1>Notifications</h1>

                    <p>
                        Stay updated about your MINEPTHE
                        book activities.
                    </p>
                </div>

                <div style={styles.card}>

                    <h2>Notifications</h2>

                    <div style={styles.empty}>
                        <h3>No New Notifications</h3>

                        <p>
                            Your book requests, donations,
                            matching updates, and collection
                            updates will appear here.
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

export default Notifications;
