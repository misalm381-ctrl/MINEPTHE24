import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyCollectionCode } from "../api";

function CollectionVerification() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [requestId, setRequestId] = useState("");
    const [collectionCode, setCollectionCode] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const requestFromUrl =
            searchParams.get("requestId") || "";

        const codeFromUrl =
            searchParams.get("code") || "";

        if (requestFromUrl) {
            setRequestId(requestFromUrl);
        }

        if (codeFromUrl) {
            setCollectionCode(codeFromUrl);
        }
    }, [searchParams]);

    async function verifyCollection(event) {
        event.preventDefault();

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const cleanRequestId =
                String(requestId).trim();

            const cleanCollectionCode =
                String(collectionCode).trim();

            if (!cleanRequestId) {
                throw new Error(
                    "Request ID is required."
                );
            }

            if (!/^\d+$/.test(cleanRequestId)) {
                throw new Error(
                    "Request ID must contain numbers only."
                );
            }

            if (!/^\d{6}$/.test(cleanCollectionCode)) {
                throw new Error(
                    "Collection code must be exactly 6 digits."
                );
            }

            const data = await verifyCollectionCode(
                Number(cleanRequestId),
                cleanCollectionCode
            );

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    "Collection verification failed."
                );
            }

            setSuccess(
                data.message ||
                "Collection completed successfully."
            );

            setRequestId("");
            setCollectionCode("");

        } catch (verificationError) {
            setError(
                verificationError.message ||
                "Unable to verify collection."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                maxWidth: "700px",
                margin: "0 auto",
                padding: "40px 20px"
            }}
        >
            <div
                style={{
                    marginBottom: "30px"
                }}
            >
                <h1>
                    Collection Verification
                </h1>

                <p
                    style={{
                        color: "#666"
                    }}
                >
                    Enter the Request ID and collection
                    code to complete the book handover.
                </p>
            </div>

            {success && (
                <div
                    style={{
                        padding: "18px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                        background: "#e8f7ee",
                        color: "#167a45"
                    }}
                >
                    <strong>
                        Collection Completed
                    </strong>

                    <p
                        style={{
                            marginBottom: 0
                        }}
                    >
                        {success}
                    </p>
                </div>
            )}

            {error && (
                <div
                    style={{
                        padding: "15px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                        background: "#fdecec",
                        color: "#b42318"
                    }}
                >
                    {error}
                </div>
            )}

            <form onSubmit={verifyCollection}>

                <div
                    style={{
                        marginBottom: "20px"
                    }}
                >
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "600"
                        }}
                    >
                        Request ID
                    </label>

                    <input
                        type="number"
                        value={requestId}
                        onChange={(event) =>
                            setRequestId(
                                event.target.value
                            )
                        }
                        placeholder="Enter request ID"
                        disabled={loading}
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "13px",
                            border: "1px solid #ccc",
                            borderRadius: "8px"
                        }}
                    />
                </div>

                <div
                    style={{
                        marginBottom: "20px"
                    }}
                >
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "600"
                        }}
                    >
                        Collection Code
                    </label>

                    <input
                        type="text"
                        value={collectionCode}
                        onChange={(event) =>
                            setCollectionCode(
                                event.target.value.replace(
                                    /\D/g,
                                    ""
                                ).slice(0, 6)
                            )
                        }
                        placeholder="Enter 6-digit collection code"
                        maxLength={6}
                        disabled={loading}
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "13px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            letterSpacing: "3px"
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "14px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#2457a6",
                        color: "#fff",
                        fontWeight: "700",
                        cursor: loading
                            ? "not-allowed"
                            : "pointer"
                    }}
                >
                    {loading
                        ? "Verifying..."
                        : "Verify Collection"}
                </button>

            </form>

            <div
                style={{
                    marginTop: "25px",
                    padding: "16px",
                    borderRadius: "10px",
                    background: "#fff8e8",
                    color: "#7a5700",
                    fontSize: "14px"
                }}
            >
                <strong>
                    Privacy & Safety
                </strong>

                <p
                    style={{
                        marginBottom: 0
                    }}
                >
                    Do not exchange personal phone
                    numbers, addresses, or other private
                    information. Use MINEPTHE for
                    collection communication.
                </p>
            </div>

            <button
                type="button"
                onClick={() =>
                    navigate("/my-requests")
                }
                style={{
                    marginTop: "20px",
                    padding: "11px 18px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    background: "#fff",
                    cursor: "pointer"
                }}
            >
                View My Requests
            </button>

        </div>
    );
}

export default CollectionVerification;