import { useNavigate } from "react-router-dom";

function Exchange() {
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

                    <h1>Book Exchange</h1>

                    <p>
                        Manage academic book exchange requests
                        through MINEPTHE.
                    </p>
                </div>

                <div style={styles.card}>

                    <h2>Exchange Books</h2>

                    <p>
                        This section will allow students to
                        exchange academic books with other
                        students.
                    </p>

                    <div style={styles.info}>
                        <h3>How Exchange Works</h3>

                        <ol>
                            <li>
                                Find an academic book.
                            </li>

                            <li>
                                Send an exchange request.
                            </li>

                            <li>
                                The other student reviews
                                the request.
                            </li>

                            <li>
                                Complete the exchange using
                                the approved collection process.
                            </li>
                        </ol>
                    </div>

                    <button
                        onClick={() => navigate("/books")}
                        style={styles.primaryButton}
                    >
                        Browse Books
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={styles.secondaryButton}
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

    info: {
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
        fontWeight: "600",
        marginRight: "10px"
    },

    secondaryButton: {
        padding: "11px 18px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#ffffff",
        cursor: "pointer",
        fontWeight: "600"
    }
};

export default Exchange;
