import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [city, setCity] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !fullName ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword ||
            !city
        ) {
            setError("Please complete all fields.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            setError(
                "Please enter a valid 10-digit phone number."
            );
            return;
        }

        /*
          Temporary frontend registration.

          Later this will connect to:

          POST /api/auth/register

          The backend will save the account
          securely in MySQL.
        */

        setSuccess(
            "Account created successfully! Redirecting to login..."
        );

        setTimeout(() => {
            navigate("/login");
        }, 1200);
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
                    />


                    <label>
                        Phone Number
                    </label>

                    <input
                        type="tel"
                        placeholder="10-digit phone number"
                        value={phone}
                        onChange={(event) =>
                            setPhone(event.target.value)
                        }
                        maxLength="10"
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
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
                    />


                    <label>
                        City / Location
                    </label>

                    <input
                        type="text"
                        placeholder="Example: Pune"
                        value={city}
                        onChange={(event) =>
                            setCity(event.target.value)
                        }
                    />


                    <div
                        className="demo-note"
                        style={{ marginTop: "10px" }}
                    >
                        🔒 Your personal information is private
                        and will not be displayed publicly.
                    </div>


                    <button type="submit">
                        Create Account →
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