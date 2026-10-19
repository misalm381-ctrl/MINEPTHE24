import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../api";
import "./Books.css";

function Books() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadBooks();
    }, []);

    async function loadBooks() {
        try {
            setLoading(true);
            setError("");

            const data = await getBooks();

            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.books)
                    ? data.books
                    : [];

            setBooks(list);
        } catch (err) {
            setError(
                err.message ||
                "Unable to load books."
            );
        } finally {
            setLoading(false);
        }
    }

    function openBook(book) {
        if (!book?.id) {
            return;
        }

        navigate(`/book-details/${book.id}`);
    }

    const filteredBooks = books.filter((book) => {
        const text = [
            book.title,
            book.author,
            book.subject,
            book.department,
            book.year,
            book.description
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return text.includes(
            search.trim().toLowerCase()
        );
    });

    return (
        <div className="books-page">

            {/* HEADER */}

            <section className="books-hero">

                <div className="books-hero-brand">

                    <img
                        src="/minepthe-symbol.png"
                        alt="MINEPTHE Logo"
                        className="books-hero-logo"
                    />

                    <div>

                        <span className="books-eyebrow">
                            MINEPTHE · BOOK NETWORK
                        </span>

                        <h1>
                            Browse Books
                        </h1>

                        <p>
                            Discover academic books shared by
                            students through the MINEPTHE network.
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    className="books-dashboard-button"
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>

            </section>

            {/* SEARCH */}

            <section className="books-search-section">

                <div className="books-search-box">

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search by title, author, subject, department..."
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                        >
                            Clear
                        </button>
                    )}

                </div>

                <div className="books-count">

                    {loading
                        ? "Loading books..."
                        : `${filteredBooks.length} book${
                            filteredBooks.length === 1
                                ? ""
                                : "s"
                        } found`
                    }

                </div>

            </section>

            {/* CONTENT */}

            <section className="books-content">

                {loading && (
                    <div className="books-message">

                        <div className="books-message-icon">
                            BOOK
                        </div>

                        <h2>
                            Loading books...
                        </h2>

                        <p>
                            MINEPTHE is loading available
                            academic books.
                        </p>

                    </div>
                )}

                {!loading && error && (
                    <div className="books-message books-error">

                        <div className="books-message-icon">
                            !
                        </div>

                        <h2>
                            Unable to load books
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadBooks}
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {!loading &&
                    !error &&
                    filteredBooks.length === 0 && (
                        <div className="books-message">

                            <div className="books-message-icon">
                                BOOK
                            </div>

                            <h2>
                                No books found
                            </h2>

                            <p>
                                {search
                                    ? "Try a different search term."
                                    : "There are currently no books available."
                                }
                            </p>

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                >
                                    Clear Search
                                </button>
                            )}

                        </div>
                    )}

                {!loading &&
                    !error &&
                    filteredBooks.length > 0 && (

                        <div className="books-grid">

                            {filteredBooks.map((book) => {

                                const image =
                                    book.cover_image ||
                                    book.coverImage ||
                                    book.image ||
                                    "";

                                return (
                                    <article
                                        key={book.id}
                                        className="book-card"
                                    >

                                        <div className="book-card-image">

                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={
                                                        book.title ||
                                                        "Academic book"
                                                    }
                                                />
                                            ) : (
                                                <div className="book-card-no-image">
                                                    <strong>
                                                        BOOK
                                                    </strong>

                                                    <span>
                                                        No image
                                                    </span>
                                                </div>
                                            )}

                                        </div>

                                        <div className="book-card-content">

                                            <span className="book-card-status">
                                                {book.status ||
                                                    "Available"}
                                            </span>

                                            <h2>
                                                {book.title ||
                                                    "Untitled Book"}
                                            </h2>

                                            <p className="book-card-author">
                                                {book.author
                                                    ? `By ${book.author}`
                                                    : "Author not provided"}
                                            </p>

                                            <div className="book-card-details">

                                                {book.subject && (
                                                    <span>
                                                        <strong>
                                                            Subject:
                                                        </strong>{" "}
                                                        {book.subject}
                                                    </span>
                                                )}

                                                {book.department && (
                                                    <span>
                                                        <strong>
                                                            Department:
                                                        </strong>{" "}
                                                        {book.department}
                                                    </span>
                                                )}

                                                {book.year && (
                                                    <span>
                                                        <strong>
                                                            Year:
                                                        </strong>{" "}
                                                        {book.year}
                                                    </span>
                                                )}

                                            </div>

                                            {book.description && (
                                                <p className="book-card-description">
                                                    {book.description.length >
                                                    140
                                                        ? `${book.description.slice(
                                                            0,
                                                            140
                                                        )}...`
                                                        : book.description}
                                                </p>
                                            )}

                                            <button
                                                type="button"
                                                className="book-card-button"
                                                onClick={() =>
                                                    openBook(book)
                                                }
                                            >
                                                View Book Details
                                            </button>

                                        </div>

                                    </article>
                                );
                            })}

                        </div>
                    )}

            </section>

            {/* FOOTER SAFETY REMINDER */}

            <section className="books-safety">

                <div>

                    <strong>
                        Safe Academic Book Sharing
                    </strong>

                    <p>
                        Do not share personal phone numbers,
                        passwords, email addresses or other
                        private information. Use the MINEPTHE
                        collection process when receiving a book.
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

export default Books;

