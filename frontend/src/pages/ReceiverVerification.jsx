import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitReceiverVerification } from "../api";

function ReceiverVerification() {
    const navigate = useNavigate();

    const [collegeName, setCollegeName] = useState("");
    const [idCardImage, setIdCardImage] = useState("");
    const [idCardName, setIdCardName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function getCurrentUser() {
        try {
            const saved =
                localStorage.getItem("mineptheUser") ||
                localStorage.getItem("mineptheCurrentUser") ||
                localStorage.getItem("currentUser");

            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    }

    function handleIdCardChange(event) {
        const file = event.target.files?.[0];

        if (!file) {
            setIdCardImage("");
            setIdCardName("");
            return;
        }

        setIdCardName(file.name);

        const reader = new FileReader();

        reader.onload = () => {
            setIdCardImage(String(reader.result || ""));
        };

        reader.readAsDataURL(file);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        const user = getCurrentUser();

        if (!user?.id) {
            setError(
                "Your login session was not found. Please login again."
            );
            return;
        }

        if (!collegeName.trim()) {
            setError(
                "College or School name is required."
            );
            return;
        }

        if (!idCardImage) {
            setError(
                "Please upload your College or School ID card."
            );
            return;
        }

        try {
            setLoading(true);

            const data = await submitReceiverVerification({
                userId: Number(user.id),
                institutionName: collegeName.trim(),
                idCardImage
            });

            if (!data || data.success === false) {
                throw new Error(
                    data?.message ||
                    "Receiver verification failed."
                );
            }

            localStorage.setItem(
                "receiverVerification",
                JSON.stringify({
                    collegeName: collegeName.trim(),
                    idCardName,
                    verified: false,
                    submittedAt: new Date().toISOString()
                })
            );

            navigate("/books");

        } catch (err) {
            setError(
                err?.message ||
                "Unable to submit receiver verification."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-page">

            <form
                className="form-box"
                onSubmit={handleSubmit}
            >

                <div className="section-tag">
                    RECEIVER VERIFICATION
                </div>

                <h1>Verify as a Receiver</h1>

                <p>
                    Complete your college or school verification
                    before requesting an academic book.
                </p>

                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "12px",
                            borderRadius: "8px",
                            marginBottom: "18px",
                            fontSize: "14px"
                        }}
                    >
                        {error}
                    </div>
                )}

                <label>
                    College / School Name
                </label>

                <input
                    type="text"
                    value={collegeName}
                    onChange={(event) =>
                        setCollegeName(event.target.value)
                    }
                    placeholder="Enter your college or school name"
                    disabled={loading}
                />

                <label>
                    College / School ID Card
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleIdCardChange}
                    disabled={loading}
                />

                {idCardName && (
                    <p
                        style={{
                            fontSize: "13px",
                            marginTop: "8px"
                        }}
                    >
                        Selected: {idCardName}
                    </p>
                )}

                <div
                    style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "14px",
                        marginTop: "18px",
                        marginBottom: "20px",
                        fontSize: "13px"
                    }}
                >
                    <strong>Verification information</strong>

                    <p style={{ marginBottom: 0 }}>
                        MINEPTHE requires only your
                        college/school name and ID card for
                        receiver verification.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Submitting..."
                        : "Submit Verification →"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/books")}
                    disabled={loading}
                    style={{
                        marginTop: "12px",
                        background: "#e5e7eb",
                        color: "#111827"
                    }}
                >
                    Browse Books
                </button>

            </form>

        </div>
    );
}

export default ReceiverVerification;