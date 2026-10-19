import { Link } from "react-router-dom";
import "../home.css";

function Home() {
    return (
        <div className="home-page">

            {/* WATERMARK */}
            <div className="home-watermark">
                <img
                    src="/minepthe-symbol.png"
                    alt=""
                />
            </div>

            {/* NAVBAR */}
            <header className="home-navbar">

                <Link to="/" className="home-brand">

                    <div className="home-logo">
                        <img
                            src="/minepthe-symbol.png"
                            alt="MINEPTHE"
                        />
                    </div>

                    <div className="home-brand-text">
                        <strong>MINEPTHE</strong>
                        <span>
                            Smart Academic Book Sharing
                        </span>
                    </div>

                </Link>

                <nav className="home-nav">

                    <Link
                        to="/"
                        className="home-nav-link home-nav-active"
                    >
                        Home
                    </Link>

                    <Link
                        to="/books"
                        className="home-nav-link"
                    >
                        Books
                    </Link>

                    <Link
                        to="/receive-book"
                        className="home-nav-link"
                    >
                        Receive
                    </Link>

                    <Link
                        to="/donate-book"
                        className="home-nav-link"
                    >
                        Donate
                    </Link>

                    <Link
                        to="/smart-matching"
                        className="home-nav-link"
                    >
                        Smart Matching
                    </Link>

                </nav>

                <div className="home-auth">

                    <Link
                        to="/login"
                        className="home-login"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="home-register"
                    >
                        Get Started
                    </Link>

                </div>

            </header>

            {/* HERO */}
            <main>

                <section className="home-hero">

                    <div className="home-hero-content">

                        <div className="home-eyebrow">
                            SMART ACADEMIC BOOK SHARING
                        </div>

                        <h1>
                            Give a book.
                            <br />
                            <span>
                                Change a student's journey.
                            </span>
                        </h1>

                        <p className="home-hero-description">
                            MINEPTHE connects students who have
                            academic books with students who need
                            them through intelligent matching,
                            verification and safe collection
                            processes.
                        </p>

                        <div className="home-hero-buttons">

                            <Link
                                to="/books"
                                className="home-primary-button"
                            >
                                Explore Books
                            </Link>

                            <Link
                                to="/donate-book"
                                className="home-secondary-button"
                            >
                                Donate a Book
                            </Link>

                        </div>

                        <div className="home-trust-row">

                            <span>
                                ✓ AI-assisted verification
                            </span>

                            <span>
                                ✓ Smart matching
                            </span>

                            <span>
                                ✓ Safety-focused collection
                            </span>

                        </div>

                    </div>

                    {/* HERO VISUAL */}
                    <div className="home-visual">

                        <div className="home-visual-card">

                            <div className="visual-top">

                                <span>
                                    MINEPTHE
                                </span>

                                <span className="visual-live">
                                    ● SYSTEM ACTIVE
                                </span>

                            </div>

                            <div className="book-illustration">

                                <div className="book-cover">

                                    <div className="book-symbol">
                                        M
                                    </div>

                                    <strong>
                                        ACADEMIC
                                    </strong>

                                    <small>
                                        BOOK NETWORK
                                    </small>

                                </div>

                            </div>

                            <div className="visual-flow">

                                <div>
                                    <strong>
                                        DONOR
                                    </strong>

                                    <small>
                                        Shares knowledge
                                    </small>
                                </div>

                                <span>
                                    →
                                </span>

                                <div>
                                    <strong>
                                        MINEPTHE
                                    </strong>

                                    <small>
                                        Matches resources
                                    </small>
                                </div>

                                <span>
                                    →
                                </span>

                                <div>
                                    <strong>
                                        STUDENT
                                    </strong>

                                    <small>
                                        Finds opportunity
                                    </small>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* FEATURES */}
                <section className="home-feature-strip">

                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            AI
                        </div>

                        <div>
                            <strong>
                                AI Book Analysis
                            </strong>

                            <p>
                                Identify important book
                                information from images.
                            </p>
                        </div>

                    </div>

                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            DSA
                        </div>

                        <div>
                            <strong>
                                Smart Matching
                            </strong>

                            <p>
                                Match academic resources
                                using intelligent algorithms.
                            </p>
                        </div>

                    </div>

                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            SAFE
                        </div>

                        <div>
                            <strong>
                                Safe Collection
                            </strong>

                            <p>
                                Designed around verified
                                collection points.
                            </p>
                        </div>

                    </div>

                </section>

                {/* HOW IT WORKS */}
                <section className="home-how">

                    <div className="home-section-heading">

                        <span>
                            HOW MINEPTHE WORKS
                        </span>

                        <h2>
                            Academic resources,
                            <br />
                            connected intelligently.
                        </h2>

                        <p>
                            A simple flow designed to make
                            academic book sharing easier.
                        </p>

                    </div>

                    <div className="home-steps">

                        <div className="home-step">

                            <div className="step-number">
                                01
                            </div>

                            <h3>
                                Give
                            </h3>

                            <p>
                                A donor adds an academic book
                                that another student can use.
                            </p>

                        </div>

                        <div className="home-step">

                            <div className="step-number">
                                02
                            </div>

                            <h3>
                                Find
                            </h3>

                            <p>
                                Students search for books based
                                on their academic requirements.
                            </p>

                        </div>

                        <div className="home-step">

                            <div className="step-number">
                                03
                            </div>

                            <h3>
                                Match
                            </h3>

                            <p>
                                MINEPTHE uses AI and DSA concepts
                                to support relevant matching.
                            </p>

                        </div>

                        <div className="home-step">

                            <div className="step-number">
                                04
                            </div>

                            <h3>
                                Grow
                            </h3>

                            <p>
                                Books continue their journey
                                from one student to another.
                            </p>

                        </div>

                    </div>

                </section>

                {/* TECHNOLOGY */}
                <section className="home-technology">

                    <div className="technology-copy">

                        <span>
                            AI + DATA STRUCTURES
                        </span>

                        <h2>
                            Built for
                            <br />
                            academic intelligence.
                        </h2>

                        <p>
                            MINEPTHE combines intelligent
                            services with core data structures
                            to create a practical academic
                            resource-sharing system.
                        </p>

                        <Link
                            to="/smart-matching"
                            className="technology-button"
                        >
                            Explore Smart Matching →
                        </Link>

                    </div>

                    <div className="technology-grid">

                        <div className="technology-card">
                            <strong>
                                HASH TABLE
                            </strong>

                            <span>
                                Fast book lookup
                            </span>
                        </div>

                        <div className="technology-card">
                            <strong>
                                HEAP
                            </strong>

                            <span>
                                Priority-based matching
                            </span>
                        </div>

                        <div className="technology-card">
                            <strong>
                                GRAPH
                            </strong>

                            <span>
                                Academic connections
                            </span>
                        </div>

                        <div className="technology-card">
                            <strong>
                                DIJKSTRA
                            </strong>

                            <span>
                                Efficient route calculation
                            </span>
                        </div>

                    </div>

                </section>

            </main>

            {/* FOOTER */}
            <footer className="home-footer">

                <div>
                    <strong>
                        MINEPTHE
                    </strong>

                    <span>
                        Smart Academic Book Sharing & Matching System
                    </span>
                </div>

                <div className="home-footer-motto">
                    Give • Find • Grow
                </div>

            </footer>

        </div>
    );
}

export default Home;