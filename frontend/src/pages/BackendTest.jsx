import { useEffect, useState } from "react";

function BackendTest() {
    const [status, setStatus] = useState("Checking backend...");
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");

    const checkBackend = async () => {
        setStatus("Checking backend...");
        setError("");

        try {
            const response = await fetch(
                "http://localhost:3000/"
            );

            const text = await response.text();

            if (response.ok) {
                setStatus(
                    "Backend is running successfully."
                );
            } else {
                setStatus(
                    "Backend responded with an error."
                );

                setError(text);
            }
        } catch (err) {
            setStatus("Backend is not reachable.");

            setError(
                err.message ||
                    "Could not connect to backend."
            );
        }
    };

    const loadBooks = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/api/books"
            );

            if (!response.ok) {
                throw new Error(
                    "Could not load books."
                );
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                setBooks(data);
            } else if (Array.isArray(data.books)) {
                setBooks(data.books);
            } else {
                setBooks([]);
            }
        } catch (err) {
            setBooks([]);
        }
    };

    useEffect(() => {
        checkBackend();
        loadBooks();
    }, []);

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                <div style={styles.header}>
                    <h1>MINEPTHE Backend Test</h1>

                    <p>
                        Test the connection between the
                        React frontend and Node.js backend.
                    </p>
                </div>

                <div style={styles.card}>
                    <h2>Backend Status</h2>

                    <p style={styles.status}>
                        {status}
                    </p>

                    {error && (
                        <div style={styles.error}>
                            {error}
                        </div>
                    )}

                    <button
                        onClick={checkBackend}
                        style={styles.primaryButton}
                    >
                        Check Backend Again
                    </button>
                </div>

                <div style={styles.card}>
                    <h2>Books API</h2>

                    {books.length === 0 ? (
                        <p style={styles.empty}>
                            No books returned from the
                            backend.
                        </p>
                    ) : (
                        <div style={styles.books}>
                            {books.map((book, index) => (
                                <div
                                    key={
                                        book.id ||
                                        "book-" + index
                                    }
                                    style={styles.book}
                                >
                                    <h3>
                                        {book.title ||
                                            "Untitled Book"}
                                    </h3>

                                    <p>
                                        Author:{" "}
                                        {book.author ||
                                            "Not available"}
                                    </p>

                                    <p>
                                        Subject:{" "}
                                        {book.subject ||
                                            "Not available"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={loadBooks}
                        style={styles.secondaryButton}
                    >
                        Reload Books
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
        maxWidth: "900px",
        margin: "0 auto"
    },

    header: {
        marginBottom: "25px"
    },

    card: {
        background: "#ffffff",
        padding: "25px",
        marginBottom: "20px",
        borderRadius: "12px",
        boxShadow:
            "0 4px 12px rgba(0, 0, 0, 0.08)"
    },

    status: {
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "15px"
    },

    error: {
        padding: "12px",
        marginBottom: "15px",
        background: "#fff1f1",
        border: "1px solid #e0aaaa",
        borderRadius: "8px",
        wordBreak: "break-word"
    },

    books: {
        display: "grid",
        gap: "12px",
        marginBottom: "20px"
    },

    book: {
        padding: "15px",
        border: "1px solid #e5e7eb",
        borderRadius: "10px"
    },

    empty: {
        color: "#777",
        marginBottom: "20px"
    },

    primaryButton: {
        padding: "12px 20px",
        border: "none",
        borderRadius: "8px",
        background: "#222",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "600"
    },

    secondaryButton: {
        padding: "12px 20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#fff",
        cursor: "pointer",
        fontWeight: "600"
    }
};

export default BackendTest;