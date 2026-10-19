import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

export default function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("admin@minepthe.com");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleLogin(event) {
        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password
                    })
                }
            );

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                data = {
                    message: text || "Server returned an invalid response."
                };
            }

            if (!response.ok) {
                setMessage(
                    data.message ||
                    `Admin login failed. Server returned HTTP ${response.status}.`
                );
                return;
            }

            if (!data.token) {
                setMessage(
                    data.message ||
                    "Login succeeded, but the server did not return an admin token."
                );
                return;
            }

            localStorage.setItem("adminToken", data.token);

            if (data.admin) {
                localStorage.setItem(
                    "adminUser",
                    JSON.stringify(data.admin)
                );
            }

            navigate("/admin-dashboard");
        } catch (error) {
            setMessage(
                `Cannot connect to backend: ${error.message}`
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "440px",
                    padding: "32px",
                    borderRadius: "18px",
                    boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
                    background: "white"
                }}
            >
                <h1 style={{ marginBottom: "8px" }}>
                    MINEPTHE Admin
                </h1>

                <p style={{ marginBottom: "28px" }}>
                    Secure administrator login
                </p>

                <form onSubmit={handleLogin}>
                    <label>
                        Admin Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "6px",
                            marginBottom: "18px",
                            boxSizing: "border-box"
                        }}
                    />

                    <label>
                        Admin Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "6px",
                            marginBottom: "18px",
                            boxSizing: "border-box"
                        }}
                    />

                    {message && (
                        <div
                            style={{
                                marginBottom: "18px",
                                padding: "12px",
                                borderRadius: "8px",
                                background: "#ffe8e8",
                                color: "#a00000"
                            }}
                        >
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "13px",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer"
                        }}
                    >
                        {loading
                            ? "Logging in..."
                            : "Admin Login"}
                    </button>
                </form>

                <div style={{ marginTop: "20px" }}>
                    <Link to="/">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}