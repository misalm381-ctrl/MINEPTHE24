import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../api";

function RequestBook() {
    const navigate = useNavigate();

    const [collectionLocation, setCollectionLocation] =
        useState("");

    const [collectionPointId, setCollectionPointId] =
        useState("");

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    /* =====================================================
       SELECTED BOOK
    ===================================================== */

    const selectedBook = useMemo(() => {
        try {
            return (
                JSON.parse(
                    localStorage.getItem(
                        "mineptheSelectedBook"
                    )
                ) || null
            );
        } catch {
            return null;
        }
    }, []);

    /* =====================================================
       RECEIVER VERIFICATION
    ===================================================== */

    const receiverVerification = useMemo(() => {
        try {
            return (
                JSON.parse(
                    localStorage.getItem(
                        "receiverVerification"
                    )
                ) || null
            );
        } catch {
            return null;
        }
    }, []);

    /* =====================================================
       CURRENT USER
    ===================================================== */

    const currentUser = useMemo(() => {
        const keys = [
            "mineptheUser",
            "mineptheCurrentUser",
            "currentUser"
        ];

        for (const key of keys) {
            try {
                const value =
                    JSON.parse(
                        localStorage.getItem(key)
                    );

                if (value?.id) {
                    return value;
                }
            } catch {
                // Try next storage key.
            }
        }

        return null;
    }, []);

    /* =====================================================
       SUBMIT BOOK REQUEST
    ===================================================== */

    async function handleRequest(event) {
        event.preventDefault();

        setSuccess("");
        setError("");

        /* -------------------------------------------------
           LOGIN CHECK
        ------------------------------------------------- */

        if (!currentUser?.id) {
            setError(
                "Please login before requesting a book."
            );
            return;
        }

        /* -------------------------------------------------
           BOOK CHECK
        ------------------------------------------------- */

        if (!selectedBook?.id) {
            setError(
                "No book has been selected. Please select a book first."
            );
            return;
        }

        /* -------------------------------------------------
           RECEIVER VERIFICATION CHECK
        ------------------------------------------------- */

        if (!receiverVerification) {
            setError(
                "Receiver verification is required before requesting a book."
            );
            return;
        }

        if (
            receiverVerification.status !==
            "verified"
        ) {
            setError(
                "Your receiver verification has not been completed."
            );
            return;
        }

        /* -------------------------------------------------
           COLLECTION LOCATION
        ------------------------------------------------- */

        if (!collectionLocation.trim()) {
            setError(
                "Please enter a collection location."
            );
            return;
        }

        /* -------------------------------------------------
           SUBMIT TO BACKEND
        ------------------------------------------------- */

        try {
            setLoading(true);

            const requestData = {
                bookId: Number(selectedBook.id),

                requesterId:
                    Number(currentUser.id),

                collectionLocation:
                    collectionLocation.trim(),

                collectionPointId:
                    collectionPointId
                        ? Number(collectionPointId)
                        : null,

                donorCollectionMessage:
                    message.trim() || null
            };

            const response =
                await createRequest(requestData);

            if (
                !response ||
                response.success === false
            ) {
                throw new Error(
                    response?.message ||
                    "Unable to submit the book request."
                );
            }

            setSuccess(
                "Book request submitted successfully."
            );

            setCollectionLocation("");
            setCollectionPointId("");
            setMessage("");

            /*
             * Keep the selected book temporarily so
             * the user can see the success message.
             * Remove it shortly before moving to
             * My Requests.
             */

            setTimeout(() => {
                localStorage.removeItem(
                    "mineptheSelectedBook"
                );

                navigate("/my-requests");
            }, 1000);

        } catch (requestError) {
            console.error(
                "Book request error:",
                requestError
            );

            setError(
                requestError?.message ||
                "Unable to submit the book request. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    /* =====================================================
       NO BOOK SELECTED
    ===================================================== */

    if (!selectedBook) {
        return (
            <div className="page-container">

                <div className="page-header">
                    <h1>Request a Book</h1>

                    <p>
                        No book has been selected.
                    </p>
                </div>

                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "16px",
                        padding: "30px",
                        maxWidth: "800px"
                    }}
                >
                    <h2>
                        Select an Academic Book
                    </h2>

                    <p>
                        Browse the available books
                        and select a book before
                        submitting a request.
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

            </div>
        );
    }

    /* =====================================================
       RECEIVER VERIFICATION REQUIRED
    ===================================================== */

    if (!receiverVerification) {
        return (
            <div className="page-container">

                <div className="page-header">
                    <h1>
                        Receiver Verification Required
                    </h1>

                    <p>
                        Complete receiver verification
                        before requesting a book.
                    </p>
                </div>

                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "16px",
                        padding: "30px",
                        maxWidth: "800px"
                    }}
                >
                    <h2>
                        Verification Required
                    </h2>

                    <p>
                        MINEPTHE requires your
                        college/school name and
                        student ID-card verification
                        before you can request an
                        academic book.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap",
                            marginTop: "20px"
                        }}
                    >
                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                navigate(
                                    "/receiver-verification"
                                )
                            }
                        >
                            Complete Verification
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

            </div>
        );
    }

    /* =====================================================
       VERIFICATION NOT COMPLETE
    ===================================================== */

    if (
        receiverVerification.status !==
        "verified"
    ) {
        return (
            <div className="page-container">

                <div className="page-header">
                    <h1>
                        Verification Pending
                    </h1>

                    <p>
                        Your receiver verification
                        must be completed before
                        requesting this book.
                    </p>
                </div>

                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "16px",
                        padding: "30px",
                        maxWidth: "800px"
                    }}
                >
                    <h2>
                        Verification Status
                    </h2>

                    <p>
                        Institution:
                        {" "}
                        {receiverVerification.collegeName ||
                            receiverVerification.institutionName ||
                            "Submitted"}
                    </p>

                    <p>
                        Please wait until your
                        verification is completed.
                    </p>

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

    /* =====================================================
       REQUEST FORM
    ===================================================== */

    return (
        <div className="page-container">

            <div className="page-header">

                <h1>
                    Request This Book
                </h1>

                <p>
                    Submit your request to the
                    book donor.
                </p>

            </div>

            {/* BOOK INFORMATION */}

            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: "24px",
                    maxWidth: "850px",
                    marginBottom: "24px"
                }}
            >

                <h2>
                    {selectedBook.title ||
                        "Academic Book"}
                </h2>

                {selectedBook.author && (
                    <p>
                        <strong>
                            Author:
                        </strong>{" "}
                        {selectedBook.author}
                    </p>
                )}

                {selectedBook.subject && (
                    <p>
                        <strong>
                            Subject:
                        </strong>{" "}
                        {selectedBook.subject}
                    </p>
                )}

                {selectedBook.department && (
                    <p>
                        <strong>
                            Department:
                        </strong>{" "}
                        {selectedBook.department}
                    </p>
                )}

                {selectedBook.year && (
                    <p>
                        <strong>
                            Year:
                        </strong>{" "}
                        {selectedBook.year}
                    </p>
                )}

            </div>

            {/* REQUEST FORM */}

            <form
                onSubmit={handleRequest}
                style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: "30px",
                    maxWidth: "850px"
                }}
            >

                <h2>
                    Collection Details
                </h2>

                <p
                    style={{
                        color: "#64748b",
                        marginBottom: "24px"
                    }}
                >
                    Enter a safe public collection
                    location. Do not enter your
                    home address or personal contact
                    information.
                </p>

                {/* COLLECTION LOCATION */}

                <label
                    style={{
                        display: "block",
                        marginBottom: "20px"
                    }}
                >
                    <strong>
                        Collection Location
                    </strong>

                    <input
                        type="text"
                        value={
                            collectionLocation
                        }
                        onChange={(event) =>
                            setCollectionLocation(
                                event.target.value
                            )
                        }
                        placeholder="Example: College library / nearby shop"
                        maxLength={255}
                        required
                        style={{
                            width: "100%",
                            marginTop: "8px",
                            padding: "12px",
                            borderRadius: "8px",
                            border:
                                "1px solid #cbd5e1",
                            boxSizing:
                                "border-box"
                        }}
                    />
                </label>

                {/* COLLECTION POINT */}

                <label
                    style={{
                        display: "block",
                        marginBottom: "20px"
                    }}
                >
                    <strong>
                        Collection Point ID
                    </strong>

                    <input
                        type="number"
                        min="1"
                        value={
                            collectionPointId
                        }
                        onChange={(event) =>
                            setCollectionPointId(
                                event.target.value
                            )
                        }
                        placeholder="Optional"
                        style={{
                            width: "100%",
                            marginTop: "8px",
                            padding: "12px",
                            borderRadius: "8px",
                            border:
                                "1px solid #cbd5e1",
                            boxSizing:
                                "border-box"
                        }}
                    />

                    <small
                        style={{
                            display: "block",
                            marginTop: "6px",
                            color: "#64748b"
                        }}
                    >
                        Leave blank if a collection
                        point has not been assigned.
                    </small>
                </label>

                {/* MESSAGE */}

                <label
                    style={{
                        display: "block",
                        marginBottom: "20px"
                    }}
                >
                    <strong>
                        Message to Donor
                    </strong>

                    <textarea
                        value={message}
                        onChange={(event) =>
                            setMessage(
                                event.target.value
                            )
                        }
                        placeholder="Example: I can collect the book after my college classes."
                        rows="5"
                        maxLength={1000}
                        style={{
                            width: "100%",
                            marginTop: "8px",
                            padding: "12px",
                            borderRadius: "8px",
                            border:
                                "1px solid #cbd5e1",
                            boxSizing:
                                "border-box",
                            resize: "vertical"
                        }}
                    />
                </label>

                {/* PRIVACY NOTICE */}

                <div
                    style={{
                        background: "#f8fafc",
                        border:
                            "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "16px",
                        marginBottom: "20px"
                    }}
                >
                    <strong>
                        Privacy & Safety
                    </strong>

                    <p
                        style={{
                            marginBottom: 0,
                            marginTop: "8px",
                            fontSize: "14px",
                            color: "#475569"
                        }}
                    >
                        Do not share your phone
                        number, personal email,
                        home address, passwords,
                        or other private information.
                        MINEPTHE uses the collection
                        process instead of requiring
                        direct personal contact.
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
                            padding: "12px",
                            borderRadius: "8px",
                            marginBottom: "16px"
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
                            padding: "12px",
                            borderRadius: "8px",
                            marginBottom: "16px"
                        }}
                    >
                        {success}
                    </div>
                )}

                {/* BUTTONS */}

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap"
                    }}
                >

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Submitting Request..."
                            : "Submit Book Request"}
                    </button>

                    <button
                        type="button"
                        className="secondary-button"
                        disabled={loading}
                        onClick={() =>
                            navigate(
                                `/book-details/${selectedBook.id}`
                            )
                        }
                    >
                        Back to Book
                    </button>

                    <button
                        type="button"
                        className="secondary-button"
                        disabled={loading}
                        onClick={() =>
                            navigate("/books")
                        }
                    >
                        Browse Books
                    </button>

                </div>

            </form>

        </div>
    );
}

export default RequestBook;