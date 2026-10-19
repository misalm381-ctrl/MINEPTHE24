import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getRequests,
    createReport
} from "../api";

function MyRequests() {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [reportingId, setReportingId] = useState(null);

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
                // Continue checking other keys.
            }
        }

        return null;
    }, []);

    /* =====================================================
       LOAD MY REQUESTS
    ===================================================== */

    async function loadRequests() {
        try {
            setLoading(true);
            setError("");

            if (!currentUser?.id) {
                setError(
                    "Please login to view your book requests."
                );
                return;
            }

            const data = await getRequests(
                Number(currentUser.id)
            );

            if (data?.success === false) {
                throw new Error(
                    data.message ||
                    "Unable to load your requests."
                );
            }

            setRequests(
                Array.isArray(data?.requests)
                    ? data.requests
                    : Array.isArray(data)
                        ? data
                        : []
            );
        } catch (requestError) {
            console.error(
                "My requests error:",
                requestError
            );

            setError(
                requestError?.message ||
                "Unable to load your book requests."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, []);

    /* =====================================================
       REPORT PROBLEM
    ===================================================== */

    async function handleReport(request) {
        const reason = window.prompt(
            "Describe the collection problem:"
        );

        if (!reason || !reason.trim()) {
            return;
        }

        try {
            setReportingId(request.id);
            setError("");
            setSuccess("");

            const data = await createReport({
                requestId: Number(request.id),
                bookId: Number(request.book_id),
                reporterId: Number(currentUser.id),
                reason: reason.trim()
            });

            if (data?.success === false) {
                throw new Error(
                    data.message ||
                    "Unable to submit the report."
                );
            }

            setSuccess(
                "Problem reported successfully."
            );

            await loadRequests();
        } catch (reportError) {
            console.error(
                "Report error:",
                reportError
            );

            setError(
                reportError?.message ||
                "Unable to submit the report."
            );
        } finally {
            setReportingId(null);
        }
    }

    /* =====================================================
       STATUS HELPERS
    ===================================================== */

    function statusLabel(status) {
        const value =
            String(status || "pending")
                .toLowerCase();

        if (value === "accepted") {
            return "Accepted";
        }

        if (value === "collected") {
            return "Collected";
        }

        if (value === "rejected") {
            return "Rejected";
        }

        if (value === "reported") {
            return "Reported";
        }

        return "Pending";
    }

    function statusStyle(status) {
        const value =
            String(status || "pending")
                .toLowerCase();

        if (value === "accepted") {
            return {
                background: "#ecfdf5",
                color: "#047857",
                border: "1px solid #a7f3d0"
            };
        }

        if (value === "collected") {
            return {
                background: "#eff6ff",
                color: "#1d4ed8",
                border: "1px solid #bfdbfe"
            };
        }

        if (value === "rejected") {
            return {
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca"
            };
        }

        if (value === "reported") {
            return {
                background: "#fff7ed",
                color: "#c2410c",
                border: "1px solid #fed7aa"
            };
        }

        return {
            background: "#fffbeb",
            color: "#a16207",
            border: "1px solid #fde68a"
        };
    }

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="page-container">

                <div className="page-header">
                    <h1>My Requests</h1>
                    <p>Loading your book requests...</p>
                </div>

            </div>
        );
    }

    /* =====================================================
       MAIN PAGE
    ===================================================== */

    return (
        <div className="page-container">

            <div className="page-header">

                <h1>
                    My Book Requests
                </h1>

                <p>
                    Track your academic book
                    requests and collection status.
                </p>

            </div>

            {/* ERROR */}

            {error && (
                <div
                    style={{
                        background: "#fef2f2",
                        color: "#b91c1c",
                        border: "1px solid #fecaca",
                        padding: "14px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        maxWidth: "900px"
                    }}
                >
                    {error}
                </div>
            )}

            {/* SUCCESS */}

            {success && (
                <div
                    style={{
                        background: "#f0fdf4",
                        color: "#166534",
                        border: "1px solid #bbf7d0",
                        padding: "14px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        maxWidth: "900px"
                    }}
                >
                    {success}
                </div>
            )}

            {/* NO REQUESTS */}

            {requests.length === 0 ? (
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
                        No Book Requests
                    </h2>

                    <p>
                        You have not requested any
                        academic books yet.
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate("/books")
                        }
                    >
                        Browse Books
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

                    {requests.map((request) => {

                        const status =
                            String(
                                request.status ||
                                "pending"
                            ).toLowerCase();

                        const title =
                            request.book_title ||
                            request.title ||
                            "Academic Book";

                        const author =
                            request.book_author ||
                            request.author ||
                            "";

                        const collectionCode =
                            request.collection_code ||
                            "";

                        return (
                            <article
                                key={request.id}
                                style={{
                                    background: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "16px",
                                    padding: "24px"
                                }}
                            >

                                {/* HEADER */}

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
                                            {title}
                                        </h2>

                                        {author && (
                                            <p>
                                                <strong>
                                                    Author:
                                                </strong>{" "}
                                                {author}
                                            </p>
                                        )}

                                        <p>
                                            <strong>
                                                Request ID:
                                            </strong>{" "}
                                            {request.id}
                                        </p>

                                    </div>

                                    <span
                                        style={{
                                            ...statusStyle(
                                                status
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
                                        {statusLabel(
                                            status
                                        )}
                                    </span>

                                </div>

                                {/* COLLECTION LOCATION */}

                                {request.collection_location && (
                                    <div
                                        style={{
                                            background:
                                                "#f8fafc",
                                            border:
                                                "1px solid #e2e8f0",
                                            borderRadius:
                                                "10px",
                                            padding:
                                                "14px",
                                            marginTop:
                                                "16px"
                                        }}
                                    >
                                        <strong>
                                            Collection Location
                                        </strong>

                                        <p
                                            style={{
                                                marginBottom: 0
                                            }}
                                        >
                                            {
                                                request.collection_location
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* ACCEPTED */}

                                {status ===
                                    "accepted" && (
                                    <div
                                        style={{
                                            background:
                                                "#f0fdf4",
                                            border:
                                                "1px solid #86efac",
                                            borderRadius:
                                                "12px",
                                            padding:
                                                "18px",
                                            marginTop:
                                                "18px"
                                        }}
                                    >

                                        <h3>
                                            Book Ready
                                        </h3>

                                        <p>
                                            The donor has
                                            accepted your
                                            request.
                                        </p>

                                        {collectionCode && (
                                            <>
                                                <p>
                                                    Your
                                                    collection
                                                    code is
                                                    ready.
                                                </p>

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "28px",
                                                        fontWeight:
                                                            "700",
                                                        letterSpacing:
                                                            "5px",
                                                        margin:
                                                            "12px 0"
                                                    }}
                                                >
                                                    {
                                                        collectionCode
                                                    }
                                                </div>
                                            </>
                                        )}

                                        <p
                                            style={{
                                                fontSize:
                                                    "14px",
                                                color:
                                                    "#475569"
                                            }}
                                        >
                                            Keep the
                                            collection
                                            code private
                                            and use it
                                            only for the
                                            MINEPTHE
                                            collection
                                            process.
                                        </p>

                                        <button
                                            type="button"
                                            className="primary-button"
                                            onClick={() =>
                                                navigate(
                                                    `/collection-verification?requestId=${request.id}&code=${collectionCode}`
                                                )
                                            }
                                        >
                                            Verify Collection
                                        </button>

                                    </div>
                                )}

                                {/* COLLECTED */}

                                {status ===
                                    "collected" && (
                                    <div
                                        style={{
                                            background:
                                                "#eff6ff",
                                            border:
                                                "1px solid #bfdbfe",
                                            borderRadius:
                                                "10px",
                                            padding:
                                                "16px",
                                            marginTop:
                                                "18px"
                                        }}
                                    >
                                        <strong>
                                            Book Collected
                                        </strong>

                                        <p
                                            style={{
                                                marginBottom:
                                                    0
                                            }}
                                        >
                                            This book has
                                            been collected
                                            successfully.
                                        </p>
                                    </div>
                                )}

                                {/* REJECTED */}

                                {status ===
                                    "rejected" && (
                                    <div
                                        style={{
                                            background:
                                                "#fef2f2",
                                            border:
                                                "1px solid #fecaca",
                                            borderRadius:
                                                "10px",
                                            padding:
                                                "16px",
                                            marginTop:
                                                "18px"
                                        }}
                                    >
                                        The donor has
                                        rejected this
                                        request.
                                    </div>
                                )}

                                {/* REPORTED */}

                                {status ===
                                    "reported" && (
                                    <div
                                        style={{
                                            background:
                                                "#fff7ed",
                                            border:
                                                "1px solid #fed7aa",
                                            borderRadius:
                                                "10px",
                                            padding:
                                                "16px",
                                            marginTop:
                                                "18px"
                                        }}
                                    >
                                        This request has
                                        been reported for
                                        a collection
                                        problem.
                                    </div>
                                )}

                                {/* PENDING */}

                                {status ===
                                    "pending" && (
                                    <div
                                        style={{
                                            background:
                                                "#fffbeb",
                                            border:
                                                "1px solid #fde68a",
                                            borderRadius:
                                                "10px",
                                            padding:
                                                "16px",
                                            marginTop:
                                                "18px"
                                        }}
                                    >
                                        Waiting for the
                                        donor to respond
                                        to your request.
                                    </div>
                                )}

                                {/* REPORT */}

                                {(status ===
                                    "accepted" ||
                                    status ===
                                    "collected") && (
                                    <div
                                        style={{
                                            marginTop:
                                                "18px"
                                        }}
                                    >
                                        <button
                                            type="button"
                                            className="secondary-button"
                                            disabled={
                                                reportingId ===
                                                request.id
                                            }
                                            onClick={() =>
                                                handleReport(
                                                    request
                                                )
                                            }
                                        >
                                            {reportingId ===
                                            request.id
                                                ? "Reporting..."
                                                : "Report Collection Problem"}
                                        </button>
                                    </div>
                                )}

                                {/* PRIVACY */}

                                <div
                                    style={{
                                        background:
                                            "#f8fafc",
                                        border:
                                            "1px solid #e2e8f0",
                                        borderRadius:
                                            "10px",
                                        padding:
                                            "14px",
                                        marginTop:
                                            "18px",
                                        fontSize:
                                            "14px",
                                        color:
                                            "#475569"
                                    }}
                                >
                                    <strong>
                                        Privacy Reminder
                                    </strong>

                                    <p
                                        style={{
                                            marginBottom: 0,
                                            marginTop:
                                                "6px"
                                        }}
                                    >
                                        Do not share
                                        personal phone
                                        numbers,
                                        passwords,
                                        private email
                                        addresses, or
                                        home addresses.
                                        Use the MINEPTHE
                                        collection
                                        process.
                                    </p>
                                </div>

                            </article>
                        );
                    })}

                </div>
            )}

            {/* FOOTER BUTTONS */}

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
                    onClick={loadRequests}
                >
                    Refresh Requests
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                        navigate("/books")
                    }
                >
                    Browse Books
                </button>

            </div>

        </div>
    );
}

export default MyRequests;