import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeBook } from "../api";

function BookVerification() {
    const navigate = useNavigate();
    console.log("MINEPTHE BOOK VERIFICATION PAGE LOADED");

    const [method, setMethod] = useState("");

    const [imagePreview, setImagePreview] = useState("");
    const [imageData, setImageData] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [book, setBook] = useState({
        title: "",
        author: "",
        subject: "",
        language: "",
        isbn: ""
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        setError("");
        setMessage("");

        const reader = new FileReader();

        reader.onload = () => {
            setImagePreview(reader.result);
            setImageData(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setBook((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const verifyWithAI = async () => {
        if (!imageData) {
            setError("Please upload or capture a book image first.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
 const result = await analyzeBook(imageData);   

            const detectedBook = result?.analysis?.book;

if (result?.success && detectedBook) {
    setBook((previous) => ({
        ...previous,
        title: detectedBook.title || previous.title,
        author: detectedBook.author || previous.author,
        subject: detectedBook.subject || previous.subject,
        language: detectedBook.language || previous.language,
        isbn: detectedBook.isbn || previous.isbn
    }));

    setMessage(
        "AI verification completed. Please check and correct the details before continuing."
    );
} else {
    setMessage(
        "AI could not identify all details. You can enter the missing information manually."
    );
}
        } finally {
            setLoading(false);
        }
    };

    const continueToDonate = () => {
        if (!book.title.trim()) {
            setError("Book title is required.");
            return;
        }

        localStorage.setItem(
            "verifiedBook",
            JSON.stringify({
                ...book,
                image: imageData,
                verifiedByAI: method === "image"
            })
        );

        navigate("/donate-book-form");
    };

    const resetMethod = () => {
        setMethod("");
        setError("");
        setMessage("");
    };

    return (

        <div style={styles.page}>
            <div style={styles.container}>

                <div style={styles.header}>
                    <h1>Book Verification</h1>

                    <p>
                        Choose how you want to provide your book information.
                    </p>
                </div>

                {!method && (
                    <div style={styles.card}>

                        <h2 style={styles.centerTitle}>
                            How would you like to verify your book?
                        </h2>

                        <p style={styles.centerText}>
                            MINEPTHE provides two simple options.
                        </p>

                        <div style={styles.optionGrid}>

                            <button
                                onClick={() => setMethod("manual")}
                                style={styles.optionCard}
                            >
                                <div style={styles.optionIcon}>
                                    BOOK
                                </div>

                                <h3 style={{ color: "#172033", margin: "0 0 10px 0" }}>
    Enter Book Details
</h3>

                                <p>
                                    Enter the book information yourself.
                                    You can provide the title, author,
                                    subject, language and ISBN.
                                </p>

                                <span style={styles.optionAction}>
                                    Enter Details
                                </span>
                            </button>

                            <button
                                onClick={() => setMethod("image")}
                                style={styles.optionCard}
                            >
                                <div style={styles.optionIcon}>
                                    AI
                                </div>

                                <h3 style={{ color: "#172033", margin: "0 0 10px 0" }}>
    Verify Using Book Image
</h3>

                                <p>
                                    Upload or capture a clear image of the
                                    book. MINEPTHE AI will analyze the image
                                    and suggest the book details.
                                </p>

                                <span style={styles.optionAction}>
                                    Use Image Verification
                                </span>
                            </button>

                        </div>

                    </div>
                )}

                {method === "manual" && (
                    <div style={styles.card}>

                        <div style={styles.sectionHeader}>
                            <div>
                                <h2>Enter Book Details</h2>

                                <p style={styles.helpText}>
                                    Enter the available information manually.
                                </p>
                            </div>

                            <button
                                onClick={resetMethod}
                                style={styles.smallButton}
                            >
                                Change Option
                            </button>
                        </div>

                        <BookDetailsForm
                            book={book}
                            handleChange={handleChange}
                        />

                        <div style={styles.notice}>
                            You can enter the ISBN if it is available.
                            Missing optional information can be left blank.
                        </div>

                        {error && (
                            <div style={styles.error}>
                                {error}
                            </div>
                        )}

                        <div style={styles.buttonRow}>

                            <button
    onClick={() => navigate("/books")}
    style={styles.secondaryButton}
>
    Browse Books
</button>

                            <button
                                onClick={continueToDonate}
                                style={styles.primaryButton}
                            >
                                Continue to Donate
                            </button>

                        </div>

                    </div>
                )}

                {method === "image" && (
                    <>
                        <div style={styles.card}>

                            <div style={styles.sectionHeader}>
                                <div>
                                    <h2>Verify Using Book Image</h2>

                                    <p style={styles.helpText}>
                                        Upload or capture a clear image of
                                        the book and let MINEPTHE AI analyze it.
                                    </p>
                                </div>

                                <button
                                    onClick={resetMethod}
                                    style={styles.smallButton}
                                >
                                    Change Option
                                </button>
                            </div>

                            <div style={styles.uploadArea}>

                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Book preview"
                                        style={styles.preview}
                                    />
                                ) : (
                                    <div style={styles.placeholder}>
                                        <div style={styles.bookIcon}>
                                            BOOK
                                        </div>

                                        <p>
                                            No book image selected
                                        </p>
                                    </div>
                                )}

                            </div>

                            <div style={styles.buttonRow}>

                                <label style={styles.uploadButton}>
                                    Upload Image

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{
                                            display: "none"
                                        }}
                                    />
                                </label>

                                <label style={styles.uploadButton}>
                                    Camera

                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleImageChange}
                                        style={{
                                            display: "none"
                                        }}
                                    />
                                </label>

                            </div>

                            <p style={styles.helpText}>
                                One clear image is enough. Additional images
                                can be supported later if required.
                            </p>

                            <button
                                onClick={verifyWithAI}
                                disabled={
                                    loading ||
                                    !imageData
                                }
                                style={{
                                    ...styles.aiButton,
                                    opacity:
                                        loading || !imageData
                                            ? 0.6
                                            : 1
                                }}
                            >
                                {loading
                                    ? "AI is analyzing..."
                                    : "Verify with MINEPTHE AI"}
                            </button>

                        </div>

                        <div style={styles.card}>

                            <h2>Check AI-Detected Details</h2>

                            <p style={styles.helpText}>
                                MINEPTHE AI suggests information from the
                                uploaded image. You can correct anything
                                before continuing.
                            </p>

                            <BookDetailsForm
                                book={book}
                                handleChange={handleChange}
                            />

                            <div style={styles.notice}>
                                AI verification is based only on information
                                visible in the uploaded image. Always check
                                the suggested details before donating.
                            </div>

                            {message && (
                                <div style={styles.success}>
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div style={styles.error}>
                                    {error}
                                </div>
                            )}

                            <div style={styles.buttonRow}>

                               <button
    onClick={() => navigate("/books")}
    style={styles.secondaryButton}
>
    Cancel
</button>

                                <button
                                    onClick={continueToDonate}
                                    style={styles.primaryButton}
                                >
                                    Continue to Donate
                                </button>

                            </div>

                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

function BookDetailsForm({ book, handleChange }) {
    return (
        <div>

            <div style={styles.formGroup}>
                <label>Book Title</label>

                <input
                    name="title"
                    value={book.title}
                    onChange={handleChange}
                    placeholder="Enter book title"
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label>Author</label>

                <input
                    name="author"
                    value={book.author}
                    onChange={handleChange}
                    placeholder="Enter author name"
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label>Subject / Category</label>

                <input
                    name="subject"
                    value={book.subject}
                    onChange={handleChange}
                    placeholder="Example: Data Structures"
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label>Language</label>

                <input
                    name="language"
                    value={book.language}
                    onChange={handleChange}
                    placeholder="Example: English"
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label>ISBN</label>

                <input
                    name="isbn"
                    value={book.isbn}
                    onChange={handleChange}
                    placeholder="Enter ISBN if available"
                    style={styles.input}
                />
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
        textAlign: "center",
        marginBottom: "25px"
    },

    card: {
        background: "#ffffff",
        borderRadius: "14px",
        padding: "25px",
        marginBottom: "20px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
    },

   centerTitle: {
    color: "#172033",
    marginBottom: "8px"
    },

    centerText: {
        textAlign: "center",
        color: "#666666"
    },

    optionGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
        marginTop: "25px"
    },

   optionCard: {
    border: "1px solid #d9dee8",
    borderRadius: "14px",
    background: "#ffffff",
    color: "#172033",
    padding: "25px",
    textAlign: "left",
    cursor: "pointer",
    minHeight: "250px",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
},
   optionIcon: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: "15px"
},
    optionAction: {
        display: "inline-block",
        marginTop: "15px",
        fontWeight: "700"
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "15px",
        marginBottom: "15px"
    },

    smallButton: {
        padding: "8px 12px",
        border: "1px solid #bbbbbb",
        borderRadius: "7px",
        background: "#ffffff",
        cursor: "pointer"
    },

    uploadArea: {
        width: "100%",
        minHeight: "260px",
        border: "2px dashed #c8ced8",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginBottom: "18px"
    },

    preview: {
        width: "100%",
        maxHeight: "400px",
        objectFit: "contain"
    },

    placeholder: {
        textAlign: "center",
        color: "#777777"
    },

    bookIcon: {
        fontSize: "30px",
        fontWeight: "700"
    },

    buttonRow: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginTop: "15px"
    },

    uploadButton: {
        display: "inline-block",
        padding: "12px 18px",
        borderRadius: "8px",
        background: "#eeeeee",
        cursor: "pointer",
        fontWeight: "600"
    },

    aiButton: {
        width: "100%",
        marginTop: "18px",
        padding: "14px",
        border: "none",
        borderRadius: "8px",
        background: "#222222",
        color: "#ffffff",
        fontSize: "16px",
        cursor: "pointer"
    },

    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "7px",
        marginBottom: "16px"
    },

    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #cccccc",
        fontSize: "15px"
    },

    helpText: {
        color: "#666666",
        fontSize: "14px"
    },

    success: {
        marginTop: "15px",
        padding: "12px",
        borderRadius: "8px",
        background: "#e8f7e8",
        color: "#246b24"
    },

    error: {
        marginTop: "15px",
        padding: "12px",
        borderRadius: "8px",
        background: "#ffecec",
        color: "#a00000"
    },

    notice: {
        padding: "14px",
        borderRadius: "8px",
        background: "#fff7df",
        marginTop: "10px",
        fontSize: "14px"
    },

    primaryButton: {
        padding: "12px 20px",
        border: "none",
        borderRadius: "8px",
        background: "#222222",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "600"
    },

    secondaryButton: {
    padding: "12px 20px",
    border: "1px solid #bbbbbb",
    borderRadius: "8px",
    background: "#ffffff",
    color: "#172033",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px"
}
};

export default BookVerification;