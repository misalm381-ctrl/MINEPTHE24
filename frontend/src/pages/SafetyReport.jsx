import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SafetyReport() {
    const navigate = useNavigate();

    const [reportType, setReportType] = useState("");
    const [description, setDescription] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        setSuccess("");
        setError("");

        if (!reportType) {
            setError("Please select a report type.");
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

        const reports =
            JSON.parse(
                localStorage.getItem("safetyReports")
            ) || [];

        const newReport = {
            id: Date.now(),
            reportedBy:
                currentUser.name || "Student",
            reportType,
            description:
                description.trim(),
            status: "Pending Review",
            createdAt:
                new Date().toLocaleString()
        };

        localStorage.setItem(
            "safetyReports",
            JSON.stringify([
                ...reports,
                newReport
            ])
        );

        setReportType("");
        setDescription("");

        setSuccess(
            "Your safety report has been submitted successfully."
        );
    };

    return (
        <div className="page-container">

            <div className="page-header">
                <h1>Safety & Report</h1>

                <p>
                    Report a safety concern or inappropriate
                    activity related to a book exchange.
                </p>
            </div>

            {/* Emergency/Safety Notice */}
            <div
                style={{
                    maxWidth: "800px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "20px"
                }}
            >
                <strong>
                    🛡️ Your Safety Matters
                </strong>

                <p
                    style={{
                        marginBottom: 0
                    }}
                >
                    Do not meet someone privately if you
                    feel unsafe. Use approved public or
                    institutional collection points whenever
                    possible.
                </p>
            </div>

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
                    Submit a Report
                </h2>

                <div
                    style={{
                        marginBottom: "18px"
                    }}
                >
                    <label>
                        <strong>
                            Report Type *
                        </strong>
                    </label>

                    <select
                        value={reportType}
                        onChange={(event) =>
                            setReportType(
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
                            Select report type
                        </option>

                        <option value="Unsafe Collection Point">
                            Unsafe Collection Point
                        </option>

                        <option value="Inappropriate Behaviour">
                            Inappropriate Behaviour
                        </option>

                        <option value="Harassment">
                            Harassment
                        </option>

                        <option value="Fake Book Listing">
                            Fake Book Listing
                        </option>

                        <option value="Wrong Information">
                            Wrong Information
                        </option>

                        <option value="Privacy Concern">
                            Privacy Concern
                        </option>

                        <option value="Other">
                            Other
                        </option>
                    </select>
                </div>

                <div
                    style={{
                        marginBottom: "18px"
                    }}
                >
                    <label>
                        <strong>
                            Description *
                        </strong>
                    </label>

                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(
                                event.target.value
                            )
                        }
                        placeholder="Describe what happened..."
                        rows="7"
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
                        Privacy Reminder
                    </strong>

                    <p
                        style={{
                            marginBottom: 0
                        }}
                    >
                        Do not include private phone numbers,
                        home addresses, passwords, or other
                        unnecessary personal information.
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
                            navigate("/dashboard")
                        }
                    >
                        Back to Dashboard
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SafetyReport;
