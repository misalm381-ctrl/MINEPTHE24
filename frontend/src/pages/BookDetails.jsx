import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBook } from "../api";
import "./BookDetails.css";

function BookDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        loadBook();
    }, [id]);

    async function loadBook() {
        try {
            setLoading(true);
            setError("");

            const data = await getBook(id);

            const loadedBook = data?.book || data;

            setBook(loadedBook || null);
        } catch (err) {
            setError(
                err.message ||
                "Unable to load book details."
            );
        } finally {
            setLoading(false);
        }
    }

    function resetZoom() {
        setZoom(1);
    }

    function zoomIn() {
        setZoom((current) =>
            Math.min(
                Number((current + 0.25).toFixed(2)),
                2.5
            )
        );
    }

    function zoomOut() {
        setZoom((current) =>
            Math.max(
                Number((current - 0.25).toFixed(2)),
                0.5
            )
        );
    }

    function handleRequest() {
        if (!book) {
            return;
        }

        const user = JSON.parse(
            localStorage.getItem("mineptheUser") || "{}"
        );

        if (!user?.id) {
            alert(
                "Please log in before requesting a book."
            );

            navigate("/login");
            return;
        }

        localStorage.setItem(
            "mineptheSelectedBook",
            JSON.stringify(book)
        );

        navigate("/request-book");
    }

    if (loading) {
        return (
            <div className="book-details-page">
                <div className="book-details-message">
                    <div className="book-details-message-icon">
                        BOOK
                    </div>

                    <h2>
                        Loading book details...
                    </h2>

                    <p>
                        Please wait while MINEPTHE loads
                        the selected book.
                    </p>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="book-details-page">
                <div className="book-details-message">
                    <div className="book-details-message-icon">
                        BOOK
                    </div>

                    <h2>
                        Book not found
                    </h2>

                    <p>
                        {error ||
                            "This book is no longer available."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/find-books")}
                    >
                        Back to Books
                    </button>
                </div>
            </div>
        );
    }

    const image =
        book.cover_image ||
        book.coverImage ||
        book.image ||
        "";

    return (
        <div className="book-details-page">

            <section className="book-details-header">

                <button
                    type="button"
                    onClick={() => navigate("/find-books")}
                >
                    Back to Books
                </button>

                <div>
                    <p>
                        MINEPTHE · BOOK NETWORK
                    </p>

                    <h1>
                        Book Details
                    </h1>

                    <span>
                        Review the academic book before
                        requesting it.
                    </span>
                </div>

            </section>

            <section className="book-details-content">

                <div className="book-details-image-card">

                    <div className="book-details-image-container">

                        {image ? (
                            <img
                                src={image}
                                alt={book.title || "Book"}
                                style={{
                                    transform:
                                        `scale(${zoom})`
                                }}
                            />
                        ) : (
                            <div className="book-details-no-image">
                                <strong>BOOK</strong>
                                <span>
                                    No book image available
                                </span>
                            </div>
                        )}

                    </div>

                    {image && (
                        <div className="book-details-zoom-controls">

                            <button
                                type="button"
                                onClick={zoomOut}
                            >
                                −
                            </button>

                            <button
                                type="button"
                                onClick={resetZoom}
                            >
                                Reset
                            </button>

                            <button
                                type="button"
                                onClick={zoomIn}
                            >
                                +
                            </button>

                        </div>
                    )}

                </div>

                <div className="book-details-info-card">

                    <h2>
                        {book.title || "Untitled Book"}
                    </h2>

                    <div className="book-details-field">
                        <strong>Author</strong>
                        <span>
                            {book.author || "Not provided"}
                        </span>
                    </div>

                    <div className="book-details-field">
                        <strong>Subject</strong>
                        <span>
                            {book.subject || "Not provided"}
                        </span>
                    </div>

                    <div className="book-details-field">
                        <strong>Department</strong>
                        <span>
                            {book.department || "Not provided"}
                        </span>
                    </div>

                    <div className="book-details-field">
                        <strong>Academic Year</strong>
                        <span>
                            {book.year || "Not provided"}
                        </span>
                    </div>

                    <div className="book-details-field">
                        <strong>Status</strong>
                        <span>
                            {book.status || "Available"}
                        </span>
                    </div>

                    {book.description && (
                        <div className="book-details-description">
                            <strong>
                                Description
                            </strong>

                            <p>
                                {book.description}
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        className="book-details-request-button"
                        onClick={handleRequest}
                    >
                        Request This Book
                    </button>

                </div>

            </section>

            <section className="book-details-safety">

                <div>
                    <strong>
                        Safe Academic Book Sharing
                    </strong>

                    <p>
                        Do not share personal phone numbers,
                        passwords, email addresses or other
                        private information. Follow the
                        MINEPTHE collection process when
                        collecting your book.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/safety-analysis")
                    }
                >
                    Safety Center
                </button>

            </section>

        </div>
    );
}

export default BookDetails;