import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Reputation() {
    const navigate = useNavigate();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (rating === 0) {
            setError("Please select a rating.");
            return;
        }

        const savedRatings = JSON.parse(
            localStorage.getItem("ratings") || "[]"
        );

        const newRating = {
            id: Date.now(),
            rating: rating,
            comment: comment.trim(),
            createdAt: new Date().toISOString()
        };

        savedRatings.push(newRating);

        localStorage.setItem(
            "ratings",
            JSON.stringify(savedRatings)
        );

        setMessage("Thank you! Your rating has been submitted.");
        setRating(0);
        setComment("");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "40px 20px",
                background: "#f5f7fb"
            }}
        >
            <div
                style={{
                    maxWidth: "650px",
                    margin: "0 auto",
                    background: "#ffffff",
                    padding: "30px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)"
                }}
            >
                <h1 style={{ marginBottom: "10px" }}>
                    Rate Your Experience
                </h1>

                <p style={{ color: "#666", marginBottom: "25px" }}>
                    Share your experience to help build a trusted
                    MINEPTHE community.
                </p>

                {message && (
                    <div
                        style={{
                            padding: "12px",
                            marginBottom: "20px",
                            borderRadius: "8px",
                            background: "#e8f7ee",
                            color: "#176b3a"
                        }}
                    >
                        {message}
                    </div>
                )}

                {error && (
                    <div
                        style={{
                            padding: "12px",
                            marginBottom: "20px",
                            borderRadius: "8px",
                            background: "#fdeaea",
                            color: "#a52222"
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label
                        style={{
                            display: "block",
                            fontWeight: "600",
                            marginBottom: "12px"
                        }}
                    >
                        Rating
                    </label>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "25px"
                        }}
                    >
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
aria-label={"Rate " + star + " out of 5"}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    fontSize: "36px",
                                    cursor: "pointer",
                                    padding: "0",
                                    color:
                                        star <= rating
                                            ? "#f5b301"
                                            : "#cccccc"
                                }}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <label
                        htmlFor="comment"
                        style={{
                            display: "block",
                            fontWeight: "600",
                            marginBottom: "8px"
                        }}
                    >
                        Comment (Optional)
                    </label>

                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(event) =>
                            setComment(event.target.value)
                        }
                        placeholder="Tell us about your experience..."
                        rows="5"
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "12px",
                            border: "1px solid #d6d9e0",
                            borderRadius: "10px",
                            resize: "vertical",
                            marginBottom: "20px",
                            fontSize: "15px"
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "13px",
                            border: "none",
                            borderRadius: "10px",
                            background: "#222",
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        Submit Rating
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    style={{
                        width: "100%",
                        marginTop: "12px",
                        padding: "13px",
                        border: "1px solid #d6d9e0",
                        borderRadius: "10px",
                        background: "#fff",
                        color: "#222",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                >
                    Back to Dashboard
                </button>

                <div
                    style={{
                        marginTop: "25px",
                        padding: "15px",
                        borderRadius: "10px",
                        background: "#fff8e5",
                        color: "#735400",
                        fontSize: "14px",
                        lineHeight: "1.5"
                    }}
                >
                    Please provide honest and respectful feedback.
                    Ratings should reflect your actual experience
                    with the book-sharing exchange.
                </div>
            </div>
        </div>
    );
}

export default Reputation;
