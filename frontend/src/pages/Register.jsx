import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../api";

function Register() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        const cleanName = fullName.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanName || !cleanEmail || !password || !confirmPassword) {
            setError("Please complete all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const data = await registerUser({
                name: cleanName,
                email: cleanEmail,
                password
            });

            if (!data || !data.success) {
                setError(data?.message || "Registration failed. Please try again.");
                return;
            }

            // Auto-login: save token and user from registration response
            if (data.token) {
                localStorage.setItem("mineptheToken", data.token);
            }
            if (data.user) {
                localStorage.setItem("mineptheUser", JSON.stringify(data.user));
                localStorage.setItem("mineptheLoggedIn", "true");
            }

            setSuccess("Account created! Taking you to your dashboard...");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (err) {
            setError(err?.message || "Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="form-page">

            <div
                className="form-box"
                style={{ maxWidth: "620px" }}
            >

                <div className="section-tag">
                    CREATE ACCOUNT
                </div>

                <h1>
                    Join MINEPTHE.
                </h1>

                <p>
                    Create one account to find and share
                    academic books.
                </p>


                {error && (
                    <div
                        style={{
                            padding: "12px 14px",
                            marginBottom: "18px",
                            borderRadius: "8px",
                            background: "#fce8e6",
                            color: "#9b2c2c",
                            fontSize: "14px"
                        }}
                    >
                        {error}
                    </div>
                )}


                {success && (
                    <div
                        style={{
                            padding: "12px 14px",
                            marginBottom: "18px",
                            borderRadius: "8px",
                            background: "#e7f4ec",
                            color: "#245c45",
                            fontSize: "14px"
                        }}
                    >
                        {success}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    <label>
                        Full Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(event) =>
                            setFullName(event.target.value)
                        }
                        disabled={loading}
                    />


                    <label>
                        Email Address
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        disabled={loading}
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Create a password (min. 6 characters)"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        disabled={loading}
                    />


                    <label>
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        disabled={loading}
                    />


                    <div
                        className="demo-note"
                        style={{ marginTop: "10px" }}
                    >
                        🔒 Your information is securely stored and never shared publicly.
                    </div>


                    <button type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account →"}
                    </button>

                </form>


                <p
                    style={{
                        textAlign: "center",
                        marginTop: "24px"
                    }}
                >
                    Already have an account?{" "}

                    <Link
                        to="/login"
                        style={{
                            color: "#315c50",
                            fontWeight: "700"
                        }}
                    >
                        Login
                    </Link>
                </p>


                <Link to="/">
                    ← Back to Home
                </Link>

            </div>

        </div>
    );
}

export default Register;