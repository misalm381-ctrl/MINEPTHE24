import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const data = await loginUser({
                email: cleanEmail,
                password
            });

            if (!data || !data.success || !data.user) {
                setError(
                    data?.message ||
                    "Login failed. Please try again."
                );
                return;
            }

            localStorage.setItem(
                "mineptheLoggedIn",
                "true"
            );

            localStorage.setItem(
                "mineptheUser",
                JSON.stringify(data.user)
            );

            if (data.token) {
                localStorage.setItem(
                    "mineptheToken",
                    data.token
                );
            }

            navigate("/dashboard");

        } catch (err) {
            setError(
                err?.message ||
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page">
            <form
                className="form-box"
                onSubmit={handleLogin}
            >

                <div className="section-tag">
                    WELCOME BACK
                </div>

                <h1>Login to MINEPTHE.</h1>

                <p>
                    Continue finding, sharing and growing through books.
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

                <label>Email Address</label>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    disabled={loading}
                />

                <label>Password</label>

                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    disabled={loading}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: "20px"
                    }}
                >
                    <button
                        type="button"
                        onClick={() =>
                            alert(
                                "Password recovery will be connected to the backend later."
                            )
                        }
                        disabled={loading}
                        style={{
                            background: "none",
                            border: "none",
                            padding: "0",
                            color: "#315c50",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        Forgot Password?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Signing in..."
                        : "Login →"}
                </button>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "22px",
                        fontSize: "14px"
                    }}
                >
                    Don't have an account?{" "}
                    <Link to="/register">
                        Create Account
                    </Link>
                </p>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "15px"
                    }}
                >
                    <Link to="/">
                        ← Back to Home
                    </Link>
                </p>

            </form>
        </div>
    );
}

export default Login;