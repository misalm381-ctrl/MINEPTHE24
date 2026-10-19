import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getBooks } from "../api";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(true);

    let user = {};

    try {
        user =
            JSON.parse(
                localStorage.getItem("mineptheUser") || "{}"
            ) || {};
    } catch {
        user = {};
    }

    const name = user.name || "Student";

    useEffect(() => {
        async function loadBooks() {
            try {
                const data = await getBooks();

                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.books)
                        ? data.books
                        : [];

                setBooks(list.slice(0, 3));
            } catch {
                setBooks([]);
            } finally {
                setLoadingBooks(false);
            }
        }

        loadBooks();
    }, []);

    return (
        <div className="dashboard-new">

            {/* =================================================
                WELCOME
                ================================================= */}

            <section className="dashboard-welcome">

                <div className="dashboard-welcome-brand">

                    <img
                        src="/minepthe-symbol.png"
                        alt="MINEPTHE Logo"
                        className="dashboard-welcome-logo"
                    />

                    <div>

                        <span className="dashboard-eyebrow">
                            MINEPTHE · ACADEMIC NETWORK
                        </span>

                        <h1>
                            Welcome back, {name} 👋
                        </h1>

                        <p>
                            Find academic books, share resources,
                            and help other students learn.
                        </p>

                    </div>

                </div>

                <button
                    className="dashboard-browse-button"
                    type="button"
                    onClick={() => navigate("/find-books")}
                >
                    Browse Books
                </button>

            </section>


            {/* =================================================
                SEARCH
                ================================================= */}

            <section className="dashboard-search-section">

                <div className="dashboard-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search academic books, authors or subjects..."
                        onKeyDown={(event) => {
                            if (
                                event.key === "Enter" &&
                                event.target.value.trim()
                            ) {
                                navigate("/find-books");
                            }
                        }}
                    />

                    <button
                        type="button"
                        onClick={() => navigate("/find-books")}
                    >
                        Search
                    </button>

                </div>

            </section>


            {/* =================================================
                QUICK ACTIONS
                ================================================= */}

            <section className="dashboard-section">

                <div className="dashboard-section-heading">

                    <div>

                        <span>
                            QUICK ACTIONS
                        </span>

                        <h2>
                            What would you like to do?
                        </h2>

                    </div>

                </div>


                <div className="dashboard-action-grid">

                    <Link
                        to="/find-books"
                        className="dashboard-action"
                    >

                        <div className="action-icon">
                            🔎
                        </div>

                        <div>

                            <h3>
                                Find Books
                            </h3>

                            <p>
                                Browse academic books available
                                in the MINEPTHE network.
                            </p>

                        </div>

                        <span>
                            Browse →
                        </span>

                    </Link>


                    <Link
                        to="/donate-book"
                        className="dashboard-action"
                    >

                        <div className="action-icon">
                            📚
                        </div>

                        <div>

                            <h3>
                                Donate a Book
                            </h3>

                            <p>
                                Share an academic book with
                                another student.
                            </p>

                        </div>

                        <span>
                            Donate →
                        </span>

                    </Link>


                    <Link
                        to="/smart-matching"
                        className="dashboard-action"
                    >

                        <div className="action-icon">
                            🤖
                        </div>

                        <div>

                            <h3>
                                Smart Matching
                            </h3>

                            <p>
                                Use AI and DSA to find suitable
                                academic books.
                            </p>

                        </div>

                        <span>
                            Match →
                        </span>

                    </Link>


                    <Link
                        to="/my-requests"
                        className="dashboard-action"
                    >

                        <div className="action-icon">
                            📋
                        </div>

                        <div>

                            <h3>
                                My Requests
                            </h3>

                            <p>
                                Check the status of books
                                you have requested.
                            </p>

                        </div>

                        <span>
                            View →
                        </span>

                    </Link>

                </div>

            </section>


            {/* =================================================
                ACTIVITY
                ================================================= */}

            <section className="dashboard-section">

                <div className="dashboard-section-heading">

                    <div>

                        <span>
                            YOUR ACTIVITY
                        </span>

                        <h2>
                            Manage your MINEPTHE activity
                        </h2>

                    </div>

                </div>


                <div className="dashboard-activity-grid">

                    <Link
                        to="/my-donations"
                        className="activity-card"
                    >

                        <span>
                            📚
                        </span>

                        <strong>
                            My Donations
                        </strong>

                        <p>
                            View books you have shared.
                        </p>

                        <b>
                            Open →
                        </b>

                    </Link>


                    <Link
                        to="/my-requests"
                        className="activity-card"
                    >

                        <span>
                            📋
                        </span>

                        <strong>
                            My Requests
                        </strong>

                        <p>
                            Track your book requests.
                        </p>

                        <b>
                            Open →
                        </b>

                    </Link>


                    <Link
                        to="/messages"
                        className="activity-card"
                    >

                        <span>
                            💬
                        </span>

                        <strong>
                            Messages
                        </strong>

                        <p>
                            View messages related to requests.
                        </p>

                        <b>
                            Open →
                        </b>

                    </Link>


                    <Link
                        to="/profile"
                        className="activity-card"
                    >

                        <span>
                            👤
                        </span>

                        <strong>
                            My Profile
                        </strong>

                        <p>
                            Manage your academic profile.
                        </p>

                        <b>
                            Open →
                        </b>

                    </Link>

                </div>

            </section>


            {/* =================================================
                AVAILABLE BOOKS
                ================================================= */}

            <section className="dashboard-section">

                <div className="dashboard-section-heading books-heading">

                    <div>

                        <span>
                            BOOK NETWORK
                        </span>

                        <h2>
                            Available Academic Books
                        </h2>

                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/find-books")}
                    >
                        View All Books →
                    </button>

                </div>


                {loadingBooks && (
                    <div className="dashboard-books-message">

                        <strong>
                            Loading books...
                        </strong>

                    </div>
                )}


                {!loadingBooks && books.length === 0 && (
                    <div className="dashboard-books-message">

                        <strong>
                            No books available yet.
                        </strong>

                        <p>
                            Be the first student to donate an
                            academic book.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/donate-book")
                            }
                        >
                            Donate a Book
                        </button>

                    </div>
                )}


                {!loadingBooks && books.length > 0 && (
                    <div className="dashboard-books-grid">

                        {books.map((book) => (

                            <article
                                className="dashboard-book-card"
                                key={book.id}
                                onClick={() =>
                                    navigate(
                                        `/book-details/${book.id}`
                                    )
                                }
                            >

                                <div className="dashboard-book-cover">

                                    {book.cover_image ? (
                                        <img
                                            src={book.cover_image}
                                            alt={
                                                book.title ||
                                                "Academic book"
                                            }
                                        />
                                    ) : (
                                        <span>
                                            📖
                                        </span>
                                    )}

                                </div>


                                <div className="dashboard-book-info">

                                    <span>
                                        {book.status ||
                                            "Available"}
                                    </span>

                                    <h3>
                                        {book.title ||
                                            "Untitled Book"}
                                    </h3>

                                    <p>
                                        {book.author ||
                                            "Author not available"}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={(event) => {

                                            event.stopPropagation();

                                            navigate(
                                                `/book-details/${book.id}`
                                            );

                                        }}
                                    >
                                        View Book →
                                    </button>

                                </div>

                            </article>

                        ))}

                    </div>
                )}

            </section>


            {/* =================================================
                AI + DSA
                ================================================= */}

            <section className="dashboard-smart">

                <div className="dashboard-smart-heading">

                    <span>
                        AI + DSA ENGINE
                    </span>

                    <h2>
                        Smart Matching
                    </h2>

                    <p>
                        MINEPTHE combines AI with core data
                        structures to connect students with
                        relevant academic books.
                    </p>

                </div>


                <div className="dashboard-tech-grid">

                    <div>

                        <strong>
                            01
                        </strong>

                        <h3>
                            Hash Table
                        </h3>

                        <p>
                            Fast book lookup using title,
                            subject and ISBN information.
                        </p>

                    </div>


                    <div>

                        <strong>
                            02
                        </strong>

                        <h3>
                            Heap
                        </h3>

                        <p>
                            Helps prioritize important
                            academic book requests.
                        </p>

                    </div>


                    <div>

                        <strong>
                            03
                        </strong>

                        <h3>
                            Graph
                        </h3>

                        <p>
                            Connects books, students and
                            collection locations.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                SAFETY
                ================================================= */}

            <section className="dashboard-safety">

                <div>

                    <strong>
                        🛡️ Safe Academic Book Sharing
                    </strong>

                    <span>
                        Keep personal information private.
                        Use approved collection points and
                        follow MINEPTHE safety instructions
                        when collecting books.
                    </span>

                </div>

                <button
                    type="button"
                    onClick={() => navigate("/safety-analysis")}
                >
                    Safety Center
                </button>

            </section>

        </div>
    );
}

export default Dashboard;