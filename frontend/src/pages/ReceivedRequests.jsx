import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getReceivedRequests,
    updateRequestStatus,
    createHandover
} from "../api";

function ReceivedRequests() {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] =
        useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
                // Continue to the next key.
            }
        }

        return null;
    }, []);

    /* =====================================================
       LOAD RECEIVED REQUESTS
    ===================================================== */

    async function loadRequests() {
        try {
            setLoading(true);
            setError("");

            if (!currentUser?.id) {
                setError(
                    "Please login to view received book requests."
                );
                return;
            }

            const data =
                await getReceivedRequests(
                    Number(currentUser.id)
                );

            if (data?.success === false) {
                throw new Error(
                    data.message ||
                    "Unable to load received requests."
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
                "Load received requests error:",
                requestError
            );

            setError(
                requestError?.message ||
                "Unable to load received requests."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, []);

    /* =====================================================
       ACCEPT / REJECT REQUEST
    ===================================================== */

    async function changeStatus(
        requestId,
        status
    ) {
        if (!requestId) {
            return;
        }

        try {
            setProcessingId(requestId);
            setError("");
            setSuccess("");

            /* ---------------------------------------------
               ACCEPT
            --------------------------------------------- */

            if (status === "accepted") {
                const data =
                    await createHandover(
                        Number(requestId)
                    );

                if (
                    !data ||
                    data.success === false
                ) {
                    throw new Error(
                        data?.message ||
                        "Unable to accept the request."
                    );
                }

                const code =
                    data.collectionCode;

                if (code) {
                    setSuccess(
                        `Request accepted successfully. Collection code ${code} has been generated.`
                    );
                } else {
                    setSuccess(
                        "Request accepted successfully and the collection process has been created."
                    );
                }
            }

            /* ---------------------------------------------
               REJECT
            --------------------------------------------- */

            else if (
                status === "rejected"
            ) {
                const data =
                    await updateRequestStatus(
                        Number(requestId),
                        "rejected"
                    );

                if (
                    data &&
                    data.success === false
                ) {
                    throw new Error(
                        data.message ||
                        "Unable to reject the request."
                    );
                }

                setSuccess(
                    "Book request rejected successfully."
                );
            }

            /* ---------------------------------------------
               OTHER STATUS
            --------------------------------------------- */

            else {
                const data =
                    await updateRequestStatus(
                        Number(requestId),
                        status
                    );

                if (
                    data &&
                    data.success === false
                ) {
                    throw new Error(
                        data.message ||
                        "Unable to update the request."
                    );
                }

                setSuccess(
                    "Request updated successfully."
                );
            }

            await loadRequests();

        } catch (requestError) {
            console.error(
                "Request status error:",
                requestError
            );

            setError(
                requestError?.message ||
                "Unable to update the request."
            );
        } finally {
            setProcessingId(null);
        }
    }

    /* =====================================================
       STATUS LABEL
    ===================================================== */

    function getStatusLabel(status) {
        const value =
            String(status || "")
                .toLowerCase();

        if (value === "accepted") {
            return "Accepted";
        }

        if (value === "rejected") {
            return "Rejected";
        }

        if (value === "collected") {
            return "Collected";
        }

        if (value === "reported") {
            return "Reported";
        }

        return "Pending";
    }

    /* =====================================================
       STATUS CLASS
    ===================================================== */

    function getStatusStyle(status) {
        const value =
            String(status || "")
                .toLowerCase();

        if (value === "accepted") {
            return {
                background: "#ecfdf5",
                color: "#047857",
                border: "1px solid #a7f3d0"
            };
        }

        if (value === "rejected") {
            return {
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca"
            };
        }

        if (value === "collected") {
            return {
                background: "#eff6ff",
                color: "#1d4ed8",
                border: "1px solid #bfdbfe"
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
                    <h1>
                        Received Book Requests
                    </h1>

                    <p>
                        Loading requests...
                    </p>
                </div>

                <div
                    style={{
                        background: "#ffffff",
                        border:
                            "1px solid #e5e7eb",
                        borderRadius: "16px",
                        padding: "30px",
                        maxWidth: "900px"
                    }}
                >
                    Loading received requests...
                </div>

            </div>
        );
    }

    /* =====================================================
       MAIN PAGE
    ===================================================== */

    return (
        <div className="page-container">

            {/* HEADER */}

            <div className="page-header">

                <h1>
                    Received Book Requests
                </h1>

                <p>
                    Manage students' requests for
                    books you have donated.
                </p>

            </div>

            {/* ERROR */}

            {error && (
                <div
                    style={{
                        background: "#fef2f2",
                        border:
                            "1px solid #fecaca",
                        color: "#b91c1c",
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
                        border:
                            "1px solid #bbf7d0",
                        color: "#166534",
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
                        border:
                            "1px solid #e5e7eb",
                        borderRadius: "16px",
                        padding: "32px",
                        maxWidth: "900px"
                    }}
                >

                    <h2>
                        No Requests Yet
                    </h2>

                    <p>
                        You currently have no
                        book requests from
                        students.
                    </p>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/my-donations"
                            )
                        }
                    >
                        My Donations
                    </button>

                </div>
            ) : (

                /* REQUEST LIST */

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

                        const bookTitle =
                            request.book_title ||
                            request.title ||
                            "Academic Book";

                        const author =
                            request.book_author ||
                            request.author ||
                            "";

                        const requester =
                            request.requester_name ||
                            "Student";

                        const collectionLocation =
                            request.collection_location ||
                            "";

                        const collectionCode =
                            request.collection_code ||
                            "";

                        return (
                            <article
                                key={request.id}
                                style={{
                                    background:
                                        "#ffffff",
                                    border:
                                        "1px solid #e5e7eb",
                                    borderRadius:
                                        "16px",
                                    padding: "24px",
                                    boxShadow:
                                        "0 4px 14px rgba(15, 23, 42, 0.04)"
                                }}
                            >

                                {/* BOOK */}

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        gap: "16px",
                                        alignItems:
                                            "flex-start",
                                        flexWrap:
                                            "wrap"
                                    }}
                                >

                                    <div>

                                        <h2
                                            style={{
                                                marginTop: 0
                                            }}
                                        >
                                            {bookTitle}
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

                                        <p>
                                            <strong>
                                                Student:
                                            </strong>{" "}
                                            {requester}
                                        </p>

                                    </div>

                                    {/* STATUS */}

                                    <span
                                        style={{
                                            ...getStatusStyle(
                                                status
                                            ),
                                            padding:
                                                "7px 12px",
                                            borderRadius:
                                                "999px",
                                            fontSize:
                                                "13px",
                                            fontWeight:
                                                "600"
                                        }}
                                    >
                                        {getStatusLabel(
                                            status
                                        )}
                                    </span>

                                </div>

                                {/* COLLECTION */}

                                {collectionLocation && (
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
                                                marginBottom:
                                                    0
                                            }}
                                        >
                                            {
                                                collectionLocation
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* DONOR MESSAGE */}

                                {request.donor_collection_message && (
                                    <div
                                        style={{
                                            marginTop:
                                                "16px"
                                        }}
                                    >
                                        <strong>
                                            Student Message
                                        </strong>

                                        <p>
                                            {
                                                request.donor_collection_message
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* ACCEPTED CODE */}

                                {status ===
                                    "accepted" &&
                                    collectionCode && (
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

                                            <strong>
                                                Collection Code
                                            </strong>

                                            <div
                                                style={{
                                                    fontSize:
                                                        "28px",
                                                    fontWeight:
                                                        "700",
                                                    letterSpacing:
                                                        "5px",
                                                    marginTop:
                                                        "8px"
                                                }}
                                            >
                                                {
                                                    collectionCode
                                                }
                                            </div>

                                            <p
                                                style={{
                                                    marginBottom:
                                                        0,
                                                    fontSize:
                                                        "14px"
                                                }}
                                            >
                                                Give the
                                                collection
                                                code only
                                                through the
                                                MINEPTHE
                                                collection
                                                process.
                                            </p>

                                        </div>
                                    )}

                                {/* PRIVACY */}

                                {(status ===
                                    "accepted" ||
                                    status ===
                                    "pending") && (
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
                                                "16px",
                                            fontSize:
                                                "14px",
                                            color:
                                                "#475569"
                                        }}
                                    >
                                        Do not request
                                        or exchange
                                        personal phone
                                        numbers, private
                                        email addresses,
                                        passwords, or
                                        home addresses.
                                        Use the MINEPTHE
                                        collection
                                        process.
                                    </div>
                                )}

                                {/* ACTIONS */}

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        gap: "10px",
                                        flexWrap:
                                            "wrap",
                                        marginTop:
                                            "20px"
                                    }}
                                >

                                    {status ===
                                        "pending" && (
                                        <>
                                            <button
                                                type="button"
                                                className="primary-button"
                                                disabled={
                                                    processingId ===
                                                    request.id
                                                }
                                                onClick={() =>
                                                    changeStatus(
                                                        request.id,
                                                        "accepted"
                                                    )
                                                }
                                            >
                                                {processingId ===
                                                request.id
                                                    ? "Processing..."
                                                    : "Accept Request"}
                                            </button>

                                            <button
                                                type="button"
                                                className="secondary-button"
                                                disabled={
                                                    processingId ===
                                                    request.id
                                                }
                                                onClick={() =>
                                                    changeStatus(
                                                        request.id,
                                                        "rejected"
                                                    )
                                                }
                                            >
                                                Reject Request
                                            </button>
                                        </>
                                    )}

                                    {status ===
                                        "accepted" && (
                                        <button
                                            type="button"
                                            className="secondary-button"
                                            onClick={() =>
                                                navigate(
                                                    `/collection-verification?requestId=${request.id}&code=${collectionCode}`
                                                )
                                            }
                                        >
                                            View Collection
                                        </button>
                                    )}

                                </div>

                            </article>
                        );
                    })}

                </div>
            )}

            {/* SAFETY */}

            <div
                style={{
                    background: "#f8fafc",
                    border:
                        "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "20px",
                    maxWidth: "900px",
                    marginTop: "24px"
                }}
            >

                <h3>
                    Safe Book Sharing
                </h3>

                <p
                    style={{
                        marginBottom: 0
                    }}
                >
                    MINEPTHE keeps the donor and
                    receiver personal details
                    private. Use the generated
                    collection code and approved
                    collection process rather than
                    exchanging personal contact
                    information.
                </p>

            </div>

            {/* REFRESH */}

            <div
                style={{
                    marginTop: "20px"
                }}
            >
                <button
                    type="button"
                    className="secondary-button"
                    onClick={loadRequests}
                    disabled={loading}
                >
                    Refresh Requests
                </button>
            </div>

        </div>
    );
}

export default ReceivedRequests;