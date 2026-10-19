import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyDonations } from "../api";

function MyDonations() {
    const navigate = useNavigate();

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const currentUser = useMemo(() => {
        const keys = [
            "mineptheUser",
            "mineptheCurrentUser",
            "currentUser"
        ];

        for (const key of keys) {
            try {
                const user = JSON.parse(
                    localStorage.getItem(key)
                );

                if (user?.id) {
                    return user;
                }
            } catch {
                // Continue.
            }
        }

        return null;
    }, []);

    async function loadDonations() {
        try {
            setLoading(true);
            setError("");

            if (!currentUser?.id) {
                setError(
                    "Please login to view your donations."
                );
                return;
            }

            const data = await getMyDonations(
                Number(currentUser.id)
            );

            if (data?.success === false) {
                throw new Error(
                    data.message ||
                    "Unable to load donations."
                );
            }

            setDonations(
                Array.isArray(data?.books)
                    ? data.books
                    : Array.isArray(data?.donations)
                        ? data.donations
                        : Array.isArray(data)
                            ? data
                            : []
            );
        } catch (err) {
            console.error(
                "My donations error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load your donations."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDonations();
    }, []);

    function getStatusText(status) {
        switch (
            String(status || "").toLowerCase()
        ) {
            case "verified":
                return "Verified";

            case "requested":
                return "Requested";

            case "transferred":
                return "Transferred";

            case "pending":
                return "Pending Verification";

            default:
                return status || "Unknown";
        }
    }

    function getStatusStyle(status) {
        const value =
            String(status || "").toLowerCase();

        if (value === "verified") {
            return {
                background: "#ecfdf5",
                color: "#047857",
                border: "1px solid #a7f3d0"
            };
        }

        if (value === "requested") {
            return {
                background: "#eff6ff",
                color: "#1d4ed8",
                border: "1px solid #bfdbfe"
            };
        }

        if (value === "transferred") {
            return {
                background: "#f3e8ff",
                color: "#7e22ce",
                border: "1px solid #d8b4fe"
            };
        }

        return {
            background: "#fffbeb",
            color: "#a16207",
            border: "1px solid #fde68a"
        };
    }

    if (loading) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <h1>My Donations</h1>
                    <p>
                        Loading your donated books...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">
                <h1>My Donations</h1>

                <p>
                    Track the academic books you have
                    donated through MINEPTHE.
                </p>
            </div>

            {error && (
                <div
                    style={{
                        background: "#fef2f2",
                        color: "#b91c1c",
                        border: "1px solid #fecaca",
                        borderRadius: "10px",
                        padding: "14px",
                        marginBottom: "20px",
                        maxWidth: "900px"
                    }}
                >
                    {error}
                </div>
            )}

            {donations.length === 0 ? (
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "16px",
                        padding: "30px",
                        maxWidth: "900px"
                    }}
                >
                    <h2>
                        No Donations Yet
                    </h2>

                    <p>
                        You have not donated any academic
                        books yet.
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate("/donate-book")
                        }
                    >
                        Donate a Book
                    </button>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gap: "20px",
                        maxWidth: "900px"
                    }}
                >
                    {donations.map((book) => (
                        <article
                            key={book.id}
                            style={{
                                background: "#ffffff",
                                border:
                                    "1px solid #e5e7eb",
                                borderRadius: "16px",
                                padding: "24px"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    gap: "15px",
                                    flexWrap: "wrap"
                                }}
                            >
                                <div>
                                    <h2
                                        style={{
                                            marginTop: 0
                                        }}
                                    >
                                        {book.title ||
                                            "Academic Book"}
                                    </h2>

                                    {book.author && (
                                        <p>
                                            <strong>
                                                Author:
                                            </strong>{" "}
                                            {book.author}
                                        </p>
                                    )}

                                    {book.subject && (
                                        <p>
                                            <strong>
                                                Subject:
                                            </strong>{" "}
                                            {book.subject}
                                        </p>
                                    )}

                                    {book.department && (
                                        <p>
                                            <strong>
                                                Department:
                                            </strong>{" "}
                                            {book.department}
                                        </p>
                                    )}

                                    {book.year && (
                                        <p>
                                            <strong>
                                                Year:
                                            </strong>{" "}
                                            {book.year}
                                        </p>
                                    )}

                                    <p>
                                        <strong>
                                            Book ID:
                                        </strong>{" "}
                                        {book.id}
                                    </p>
                                </div>

                                <span
                                    style={{
                                        ...getStatusStyle(
                                            book.status
                                        ),
                                        padding:
                                            "7px 12px",
                                        borderRadius:
                                            "999px",
                                        height:
                                            "fit-content",
                                        fontSize:
                                            "13px",
                                        fontWeight:
                                            "600"
                                    }}
                                >
                                    {getStatusText(
                                        book.status
                                    )}
                                </span>
                            </div>

                            {book.description && (
                                <p
                                    style={{
                                        marginTop:
                                            "12px"
                                    }}
                                >
                                    {book.description}
                                </p>
                            )}

                            {book.status ===
                                "transferred" && (
                                <div
                                    style={{
                                        background:
                                            "#f3e8ff",
                                        border:
                                            "1px solid #d8b4fe",
                                        borderRadius:
                                            "10px",
                                        padding:
                                            "14px",
                                        marginTop:
                                            "16px"
                                    }}
                                >
                                    <strong>
                                        Donation Completed
                                    </strong>

                                    <p
                                        style={{
                                            marginBottom:
                                                0
                                        }}
                                    >
                                        This book has
                                        been transferred
                                        through the
                                        MINEPTHE
                                        collection
                                        process.
                                    </p>
                                </div>
                            )}

                            {book.status ===
                                "requested" && (
                                <div
                                    style={{
                                        background:
                                            "#eff6ff",
                                        border:
                                            "1px solid #bfdbfe",
                                        borderRadius:
                                            "10px",
                                        padding:
                                            "14px",
                                        marginTop:
                                            "16px"
                                    }}
                                >
                                    A student has
                                    requested this book.
                                    Check Received
                                    Requests for the
                                    request details.
                                </div>
                            )}

                        </article>
                    ))}
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginTop: "24px"
                }}
            >
                <button
                    type="button"
                    className="secondary-button"
                    onClick={loadDonations}
                >
                    Refresh Donations
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                        navigate("/received-requests")
                    }
                >
                    Received Requests
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                        navigate("/donate-book")
                    }
                >
                    Donate Another Book
                </button>
            </div>

            <div
                style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "16px",
                    marginTop: "24px",
                    maxWidth: "900px",
                    fontSize: "14px",
                    color: "#475569"
                }}
            >
                <strong>
                    Privacy & Safety
                </strong>

                <p
                    style={{
                        marginBottom: 0,
                        marginTop: "6px"
                    }}
                >
                    MINEPTHE does not require donors
                    and receivers to exchange personal
                    phone numbers, passwords, or private
                    addresses. Use the platform's
                    collection process.
                </p>
            </div>

        </div>
    );
}

export default MyDonations;