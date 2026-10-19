import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReportIssue() {
    const navigate = useNavigate();

    const [issueType, setIssueType] = useState("");
    const [description, setDescription] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        setSuccess("");
        setError("");

        if (!issueType) {
            setError("Please select an issue type.");
            return;
        }

        if (!description.trim()) {
            setError("Please describe the problem.");
            return;
        }

        const currentUser =
            JSON.parse(
                localStorage.getItem("currentUser")
            ) || {
                name: "Student"
            };

        const selectedBook =
            JSON.parse(
                localStorage.getItem("selectedBook")
            ) || null;

        const newReport = {
            id: Date.now(),
            reportedBy:
                currentUser.name || "Student",
            bookId:
                selectedBook?.id || null,
            bookTitle:
                selectedBook?.title ||
                "Unknown Book",
            issueType,
            description:
                description.trim(),
            status: "Reported",
            createdAt:
                new Date().toLocaleString()
        };

        const existingReports =
            JSON.parse(
                localStorage.getItem("issueReports")
            ) || [];

        localStorage.setItem(
            "issueReports",
            JSON.stringify([
                ...existingReports,
                newReport
            ])
        );

        setSuccess(
            "Your collection issue has been reported successfully."
        );

        setIssueType("");
        setDescription("");
    };

    return (
        <div className="page-container">

            {/* Header */}
            <div className="page-header">
                <h1>
                    Report Collection Issue
                </h1>

                <p>
                    Tell us if there is a problem while
                    collecting your book.
                </p>
            </div>

            {/* Safety Notice */}
            <div
                style={{
                    maxWidth: "800px",
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "20px"
                }}
            >
                <strong>
                    🛡️ Safety First
                </strong>

                <p
                    style={{
                        marginBottom: 0
                    }}
                >
                    If you cannot safely find or collect
                    the book, do not arrange a private
                    meeting. Report the issue through
                    MINEPTHE instead.
                </p>
            </div>

            {/* Success */}
            {success && (
                <div
                    style={{
                        maxWidth: "800px",
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        color: "#065f46",
                        borderRadius: "10px",
                        padding: "14px",
                        marginBottom: "20px"
                    }}
                >
                    ✓ {success}
                </div>
            )}

            {/* Error */}
            {error && (
                <div
                    style={{
                        maxWidth: "800px",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        color: "#991b1b",
                        borderRadius: "10px",
                        padding: "14px",
                        marginBottom: "20px"
                    }}
                >
                    ⚠️ {error}
                </div>
            )}

            {/* Report Form */}
            <form
                onSubmit={handleSubmit}
                style={{
                    maxWidth: "800px",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    padding: "20px"
                }}
            >
                <h2>
                    Collection Problem
                </h2>

                {/* Issue Type */}
                <div
                    style={{
                        marginBottom: "18px"
                    }}
                >
                    <label>
                        <strong>
                            Issue Type *
                        </strong>
                    </label>

                    <select
                        value={issueType}
                        onChange={(event) =>
                            setIssueType(
                                event.target.value
                            )
                        }
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            marginTop: "8px",
                            padding: "12px",
                            border:
                                "1px solid #d1d5db",
                            borderRadius: "10px"
                        }}
                    >
                        <option value="">
                            Select an issue
                        </option>

                        <option value="Book Not Found">
                            Book Not Found
                        </option>

                        <option value="Wrong Book">
                            Wrong Book
                        </option>

                        <option value="Collection Point Unavailable">
                            Collection Point Unavailable
                        </option>

                        <option value="Book Damaged">
                            Book Damaged
                        </option>

                        <option value="Donor Did Not Hand Over">
                            Donor Did Not Hand Over
                        </option>

                        <option value="Safety Concern">
                            Safety Concern
                        </option>

                        <option value="Other">
                            Other
                        </option>
                    </select>
                </div>

                {/* Description */}
                <div
                    style={{
                        marginBottom: "18px"
                    }}
                >
                    <label>
                        <strong>
                            Describe the Problem *
                        </strong>
                    </label>

                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(
                                event.target.value
                            )
                        }
                        placeholder="Explain what happened..."
                        rows="6"
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            marginTop: "8px",
                            padding: "12px",
                            border:
                                "1px solid #d1d5db",
                            borderRadius: "10px",
                            resize: "vertical"
                        }}
                    />
                </div>

                {/* Privacy Notice */}
                <div
                    style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "14px",
                        marginBottom: "20px"
                    }}
                >
                    <strong>
                        Privacy Notice
                    </strong>

                    <p
                        style={{
                            marginBottom: 0
                        }}
                    >
                        Do not include phone numbers,
                        email addresses, home addresses,
                        or other private contact information
                        in your report.
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap"
                    }}
                >
                    <button type="submit">
                        Submit Report
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/collection-verification"
                            )
                        }
                    >
                        Back to Collection
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ReportIssue;

