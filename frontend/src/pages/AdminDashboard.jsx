import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAdminOverview,
    getAdminMe,
    getAdminBooks,
    changeAdminPassword
} from "../api";

function AdminDashboard() {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);
    const [overview, setOverview] = useState(null);
    const [books, setBooks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [booksLoading, setBooksLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [passwordLoading, setPasswordLoading] =
        useState(false);

    useEffect(() => {
        const token =
            localStorage.getItem("mineptheAdminToken");

        if (!token) {
            navigate("/admin-login");
            return;
        }

        loadDashboard();
    }, [navigate]);

    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            const [
                adminResponse,
                overviewResponse
            ] = await Promise.all([
                getAdminMe(),
                getAdminOverview()
            ]);

            if (
                adminResponse &&
                adminResponse.success === false
            ) {
                throw new Error(
                    adminResponse.message ||
                    "Admin authentication failed."
                );
            }

            if (
                overviewResponse &&
                overviewResponse.success === false
            ) {
                throw new Error(
                    overviewResponse.message ||
                    "Unable to load admin overview."
                );
            }

            setAdmin(
                adminResponse.admin ||
                adminResponse.user ||
                adminResponse
            );

            setOverview(
                overviewResponse.overview ||
                overviewResponse
            );

            await loadBooks();

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to load admin dashboard."
            );

            if (
                String(err.message || "")
                    .toLowerCase()
                    .includes("unauthorized")
            ) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    }

    async function loadBooks() {
        try {
            setBooksLoading(true);

            const response =
                await getAdminBooks();

            if (
                response &&
                response.success === false
            ) {
                throw new Error(
                    response.message ||
                    "Unable to load books."
                );
            }

            setBooks(
                Array.isArray(response.books)
                    ? response.books
                    : []
            );

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to load admin books."
            );
        } finally {
            setBooksLoading(false);
        }
    }

    async function verifyBook(bookId) {
        try {
            setMessage("");
            setError("");

            const token =
                localStorage.getItem(
                    "mineptheAdminToken"
                );

            const response =
                await fetch(
                    `http://localhost:3000/api/admin/books/${bookId}/verify`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Book verification failed."
                );
            }

            setMessage(
                "Book verified successfully."
            );

            await loadBooks();
            await loadDashboard();

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to verify book."
            );
        }
    }

    async function handlePasswordChange(event) {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!currentPassword || !newPassword) {
            setError(
                "Please enter the current and new password."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "New password and confirmation do not match."
            );
            return;
        }

        if (newPassword.length < 6) {
            setError(
                "New password must contain at least 6 characters."
            );
            return;
        }

        try {
            setPasswordLoading(true);

            const response =
                await changeAdminPassword(
                    currentPassword,
                    newPassword
                );

            if (
                response &&
                response.success === false
            ) {
                throw new Error(
                    response.message ||
                    "Password change failed."
                );
            }

            setMessage(
                "Admin password changed successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to change password."
            );
        } finally {
            setPasswordLoading(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem(
            "mineptheAdminToken"
        );

        localStorage.removeItem(
            "mineptheAdmin"
        );

        navigate("/admin-login");
    }

    function getStatusClass(status) {
        return String(status || "")
            .toLowerCase()
            .replace(/\s+/g, "-");
    }

    if (loading) {
        return (
            <div className="admin-dashboard-page">
                <div className="admin-dashboard-container">
                    <h1>Admin Dashboard</h1>
                    <p>Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-page">
            <div className="admin-dashboard-container">

                {/* HEADER */}
                <header className="admin-dashboard-header">

                    <div>
                        <h1>
                            MINEPTHE Admin Dashboard
                        </h1>

                        <p>
                            Manage the complete
                            book-sharing system.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </header>

                {/* MESSAGES */}

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* ADMIN INFORMATION */}

                <section className="admin-section">

                    <h2>Admin Account</h2>

                    <div className="admin-info-card">

                        <p>
                            <strong>Name:</strong>{" "}
                            {admin?.name || "Admin"}
                        </p>

                        <p>
                            <strong>Email:</strong>{" "}
                            {admin?.email || "—"}
                        </p>

                        <p>
                            <strong>Role:</strong>{" "}
                            Administrator
                        </p>

                    </div>

                </section>

                {/* OVERVIEW */}

                <section className="admin-section">

                    <h2>System Overview</h2>

                    <div className="admin-stats-grid">

                        <div className="admin-stat-card">
                            <h3>Users</h3>
                            <strong>
                                {overview?.users ??
                                    overview?.totalUsers ??
                                    0}
                            </strong>
                        </div>

                        <div className="admin-stat-card">
                            <h3>Books</h3>
                            <strong>
                                {overview?.books ??
                                    overview?.totalBooks ??
                                    books.length}
                            </strong>
                        </div>

                        <div className="admin-stat-card">
                            <h3>Requests</h3>
                            <strong>
                                {overview?.requests ??
                                    overview?.totalRequests ??
                                    0}
                            </strong>
                        </div>

                        <div className="admin-stat-card">
                            <h3>Reports</h3>
                            <strong>
                                {overview?.reports ??
                                    overview?.totalReports ??
                                    0}
                            </strong>
                        </div>

                        <div className="admin-stat-card">
                            <h3>Collection Points</h3>
                            <strong>
                                {overview?.collectionPoints ??
                                    overview?.totalCollectionPoints ??
                                    0}
                            </strong>
                        </div>

                    </div>

                </section>

                {/* BOOK MANAGEMENT */}

                <section className="admin-section">

                    <div className="admin-section-title-row">

                        <div>
                            <h2>
                                Book Management
                            </h2>

                            <p>
                                Review and verify books
                                submitted to MINEPTHE.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadBooks}
                            disabled={booksLoading}
                        >
                            {booksLoading
                                ? "Refreshing..."
                                : "Refresh Books"}
                        </button>

                    </div>

                    {booksLoading && (
                        <p>
                            Loading books...
                        </p>
                    )}

                    {!booksLoading &&
                        books.length === 0 && (
                            <div className="admin-empty-state">
                                <h3>
                                    No books found
                                </h3>

                                <p>
                                    There are currently
                                    no books in the system.
                                </p>
                            </div>
                        )}

                    {!booksLoading &&
                        books.length > 0 && (

                        <div className="admin-books-list">

                            {books.map((book) => (

                                <article
                                    key={book.id}
                                    className="admin-book-card"
                                >

                                    <div className="admin-book-image">

                                        {book.cover_image ? (
                                            <img
                                                src={
                                                    book.cover_image
                                                }
                                                alt={
                                                    book.title ||
                                                    "Book cover"
                                                }
                                            />
                                        ) : (
                                            <div>
                                                No Image
                                            </div>
                                        )}

                                    </div>

                                    <div className="admin-book-content">

                                        <div className="admin-book-header">

                                            <div>
                                                <h3>
                                                    {book.title ||
                                                        "Untitled Book"}
                                                </h3>

                                                <p>
                                                    {book.author ||
                                                        "Unknown Author"}
                                                </p>
                                            </div>

                                            <span
                                                className={
                                                    `admin-book-status ${getStatusClass(
                                                        book.status
                                                    )}`
                                                }
                                            >
                                                {book.status ||
                                                    "Unknown"}
                                            </span>

                                        </div>

                                        <div className="admin-book-details">

                                            <p>
                                                <strong>
                                                    Subject:
                                                </strong>{" "}
                                                {book.subject ||
                                                    "—"}
                                            </p>

                                            <p>
                                                <strong>
                                                    Department:
                                                </strong>{" "}
                                                {book.department ||
                                                    "—"}
                                            </p>

                                            <p>
                                                <strong>
                                                    Year:
                                                </strong>{" "}
                                                {book.year ||
                                                    "—"}
                                            </p>

                                            <p>
                                                <strong>
                                                    Donor:
                                                </strong>{" "}
                                                {book.donor_name ||
                                                    "Guest Donor"}
                                            </p>

                                            {book.donor_email && (
                                                <p>
                                                    <strong>
                                                        Donor Email:
                                                    </strong>{" "}
                                                    {
                                                        book.donor_email
                                                    }
                                                </p>
                                            )}

                                        </div>

                                        {book.description && (
                                            <p className="admin-book-description">
                                                {book.description}
                                            </p>
                                        )}

                                        <div className="admin-book-actions">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/book-details/${book.id}`
                                                    )
                                                }
                                            >
                                                View Book
                                            </button>

                                            {book.status ===
                                                "pending" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        verifyBook(
                                                            book.id
                                                        )
                                                    }
                                                >
                                                    Verify Book
                                                </button>
                                            )}

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </section>

                {/* STATUS INFORMATION */}

                <section className="admin-section">

                    <h2>Book Status Summary</h2>

                    <div className="admin-status-grid">

                        <div>
                            <strong>
                                Pending
                            </strong>

                            <span>
                                {
                                    books.filter(
                                        (book) =>
                                            book.status ===
                                            "pending"
                                    ).length
                                }
                            </span>
                        </div>

                        <div>
                            <strong>
                                Verified
                            </strong>

                            <span>
                                {
                                    books.filter(
                                        (book) =>
                                            book.status ===
                                            "verified"
                                    ).length
                                }
                            </span>
                        </div>

                        <div>
                            <strong>
                                Requested
                            </strong>

                            <span>
                                {
                                    books.filter(
                                        (book) =>
                                            book.status ===
                                            "requested"
                                    ).length
                                }
                            </span>
                        </div>

                        <div>
                            <strong>
                                Transferred
                            </strong>

                            <span>
                                {
                                    books.filter(
                                        (book) =>
                                            book.status ===
                                            "transferred"
                                    ).length
                                }
                            </span>
                        </div>

                    </div>

                </section>

                {/* ADMIN ACTIONS */}

                <section className="admin-section">

                    <h2>System Management</h2>

                    <div className="admin-navigation-grid">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/books")
                            }
                        >
                            Manage Books
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/received-requests"
                                )
                            }
                        >
                            Received Requests
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/user-restrictions"
                                )
                            }
                        >
                            User Restrictions
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                loadDashboard()
                            }
                        >
                            Refresh Dashboard
                        </button>

                    </div>

                </section>

                {/* PASSWORD */}

                <section className="admin-section">

                    <h2>
                        Change Admin Password
                    </h2>

                    <form
                        className="admin-password-form"
                        onSubmit={
                            handlePasswordChange
                        }
                    >

                        <input
                            type="password"
                            placeholder="Current password"
                            value={
                                currentPassword
                            }
                            onChange={(event) =>
                                setCurrentPassword(
                                    event.target.value
                                )
                            }
                        />

                        <input
                            type="password"
                            placeholder="New password"
                            value={
                                newPassword
                            }
                            onChange={(event) =>
                                setNewPassword(
                                    event.target.value
                                )
                            }
                        />

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={
                                confirmPassword
                            }
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                        />

                        <button
                            type="submit"
                            disabled={
                                passwordLoading
                            }
                        >
                            {passwordLoading
                                ? "Changing..."
                                : "Change Password"}
                        </button>

                    </form>

                </section>

            </div>
        </div>
    );
}

export default AdminDashboard;