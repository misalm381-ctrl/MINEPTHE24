import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    matchBooks,
    getStudentProfile
} from "../api";

function SmartMatching() {
    const navigate = useNavigate();

    const [subjects, setSubjects] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);
    const [profileLoading, setProfileLoading] =
    useState(true);

useEffect(() => {
    async function loadStudentProfile() {
        try {
            const currentUser =
                JSON.parse(
                    localStorage.getItem(
                        "mineptheCurrentUser"
                    ) ||
                    localStorage.getItem(
                        "currentUser"
                    ) ||
                    localStorage.getItem(
                        "mineptheUser"
                    ) ||
                    "null"
                );

            if (!currentUser?.id) {
                return;
            }

            const response =
                await getStudentProfile(
                    currentUser.id
                );

            const profile =
                response?.profile;

            if (!profile) {
                return;
            }

            const profileSubjects = [
                profile.course,
                profile.department,
                profile.syllabus
            ]
                .filter(Boolean)
                .join(", ");

            if (profileSubjects.trim()) {
                setSubjects(profileSubjects);
            }
        } catch (profileError) {
            console.error(
                "Unable to load student profile:",
                profileError
            );
        } finally {
            setProfileLoading(false);
        }
    }

    loadStudentProfile();
}, []);

    const findBooks = async () => {
        if (!subjects.trim()) {
            setError("Please enter your academic subjects.");
            return;
        }

        setLoading(true);
        setError("");
        setSearched(false);

        try {
            const subjectList = subjects
                .split(",")
                .map((subject) => subject.trim())
                .filter((subject) => subject.length > 0);

            const response = await matchBooks(subjectList);

            if (response && response.success) {
                const matchedBooks = Array.isArray(response.books)
                    ? response.books
                    : [];

                /*
                 * The backend already calculates matchScore and
                 * sorts the results from highest to lowest.
                 *
                 * This frontend step demonstrates the same
                 * priority concept used by the DSA layer.
                 */
                matchedBooks.sort(
                    (a, b) =>
                        Number(b.matchScore || 0) -
                        Number(a.matchScore || 0)
                );

                setBooks(matchedBooks);
                setSearched(true);
            } else {
                setError(
                    response.message ||
                    "No matching books were found."
                );
            }
        } catch (err) {
            setError(
                err.message ||
                "Unable to connect to the matching service."
            );
        } finally {
            setLoading(false);
        }
    };

    const viewBook = (book) => {
        localStorage.setItem(
            "selectedBook",
            JSON.stringify(book)
        );

        navigate("/book-details");
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                <div style={styles.header}>
                    <h1>Smart MINEPTHE Matching</h1>

                    <p>
                        AI understanding + matching logic + DSA
                        sorting work together to find relevant books.
                    </p>
                </div>

                <div style={styles.card}>

                    <h2>Enter Your Subjects</h2>

                    <p style={styles.help}>
                        Enter multiple subjects separated by commas.
                    </p>

                    <textarea
                        value={subjects}
                        onChange={(event) =>
                            setSubjects(event.target.value)
                        }
                        placeholder="Example: Data Structures, DBMS, Operating Systems"
                        rows="5"
                        style={styles.textarea}
                    />

                    <button
                        onClick={findBooks}
                        disabled={loading}
                        style={styles.primaryButton}
                    >
                        {loading
                            ? "Finding Books..."
                            : "Find Smart Matches"}
                    </button>

                    {error && (
                        <div style={styles.error}>
                            {error}
                        </div>
                    )}

                </div>

                {searched && (
                    <div style={styles.card}>

                        <h2>Recommended Books</h2>

                        {books.length === 0 ? (
                            <div style={styles.empty}>
                                <h3>No matching books</h3>

                                <p>
                                    Try different or additional
                                    subject names.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/books")
                                    }
                                    style={styles.secondaryButton}
                                >
                                    Browse All Books
                                </button>
                            </div>
                        ) : (
                            <div style={styles.results}>

                                {books.map((book, index) => (
                                    <div
                                        key={book.id || index}
                                        style={styles.book}
                                    >

                                        <div style={styles.rank}>
                                            #{index + 1}
                                        </div>

                                        <div style={styles.details}>
                                            <h3>
                                                {book.title ||
                                                    "Untitled Book"}
                                            </h3>

                                            <p>
                                                Author:{" "}
                                                {book.author ||
                                                    "Unknown"}
                                            </p>

                                            <p>
                                                Subject:{" "}
                                                {book.subject ||
                                                    book.category ||
                                                    "Not specified"}
                                            </p>
                                        </div>

                                        <div
                                            style={
                                                styles.matchScore
                                            }
                                        >
                                            {book.matchScore || 0}%
                                            <span>
                                                Match
                                            </span>
                                        </div>

                                        <button
                                            onClick={() =>
                                                viewBook(book)
                                            }
                                            style={
                                                styles.secondaryButton
                                            }
                                        >
                                            View
                                        </button>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>
                )}

                <div style={styles.card}>

                    <h2>How AI + DSA Work Together</h2>

                    <div style={styles.pipeline}>

                        <div>
                            <strong>AI</strong>
                            <span>
                                Understand syllabus information
                            </span>
                        </div>

                        <div>
                            <strong>Matching</strong>
                            <span>
                                Compare subjects with book data
                            </span>
                        </div>

                        <div>
                            <strong>DSA</strong>
                            <span>
                                Calculate and organize matching results
                            </span>
                        </div>

                        <div>
                            <strong>Result</strong>
                            <span>
                                Show relevant books to the student
                            </span>
                        </div>

                    </div>

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
        maxWidth: "950px",
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

    help: {
        color: "#666666",
        fontSize: "14px"
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "14px",
        borderRadius: "8px",
        border: "1px solid #cccccc",
        fontSize: "15px",
        resize: "vertical",
        marginTop: "10px",
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
        padding: "10px 16px",
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

    empty: {
        textAlign: "center",
        padding: "20px"
    },

    results: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },

    book: {
        display: "grid",
        gridTemplateColumns: "50px 1fr auto auto",
        alignItems: "center",
        gap: "15px",
        padding: "16px",
        border: "1px solid #eeeeee",
        borderRadius: "10px"
    },

    rank: {
        fontWeight: "700",
        fontSize: "18px"
    },

    details: {
        minWidth: 0
    },

    matchScore: {
        fontSize: "18px",
        fontWeight: "700",
        textAlign: "center"
    },

    pipeline: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px"
    },

    pipelineItem: {
        padding: "15px",
        borderRadius: "10px",
        background: "#f3f4f6"
    },

    emptyText: {
        color: "#666666"
    }
};

export default SmartMatching;