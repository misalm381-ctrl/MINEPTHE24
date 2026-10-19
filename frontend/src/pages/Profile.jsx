import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();

    let user = {};

    try {
        user =
            JSON.parse(
                localStorage.getItem("mineptheUser") || "{}"
            ) || {};
    } catch {
        user = {};
    }

    const name = user.name || "Student";
    const email = user.email || "Not provided";

    const handleLogout = () => {
        localStorage.removeItem("mineptheLoggedIn");
        localStorage.removeItem("mineptheUser");
        navigate("/login");
    };

    return (
        <div className="profile-page">

            {/* PROFILE HEADER */}

            <section className="profile-header">

                <div className="profile-brand">

                    <img
                        src="/minepthe-symbol.png"
                        alt="MINEPTHE Logo"
                        className="profile-logo"
                    />

                    <div>
                        <span className="profile-eyebrow">
                            MINEPTHE · ACCOUNT
                        </span>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your MINEPTHE account and
                            academic sharing activity.
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    className="profile-back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </section>


            {/* ACCOUNT CARD */}

            <section className="profile-card">

                <div className="profile-avatar-large">
                    {name.charAt(0).toUpperCase()}
                </div>

                <div className="profile-card-main">

                    <span className="profile-status">
                        LOGGED IN
                    </span>

                    <h2>
                        {name}
                    </h2>

                    <p>
                        {email}
                    </p>

                </div>

            </section>


            {/* ACCOUNT INFORMATION */}

            <section className="profile-section">

                <div className="profile-section-title">

                    <span>
                        ACCOUNT INFORMATION
                    </span>

                    <h2>
                        Your MINEPTHE Account
                    </h2>

                </div>


                <div className="profile-info-grid">

                    <div className="profile-info-card">

                        <span>
                            NAME
                        </span>

                        <strong>
                            {name}
                        </strong>

                    </div>


                    <div className="profile-info-card">

                        <span>
                            EMAIL
                        </span>

                        <strong>
                            {email}
                        </strong>

                    </div>


                    <div className="profile-info-card">

                        <span>
                            PLATFORM
                        </span>

                        <strong>
                            MINEPTHE
                        </strong>

                    </div>


                    <div className="profile-info-card">

                        <span>
                            ACCOUNT TYPE
                        </span>

                        <strong>
                            Student
                        </strong>

                    </div>

                </div>

            </section>


            {/* PURPOSE */}

            <section className="profile-purpose">

                <div className="profile-purpose-logo">

                    <img
                        src="/minepthe-symbol.png"
                        alt=""
                    />

                </div>

                <div>

                    <span>
                        SMART ACADEMIC NETWORK
                    </span>

                    <h2>
                        Share. Find. Learn.
                    </h2>

                    <p>
                        MINEPTHE helps students share useful
                        academic books and discover resources
                        they need for their studies.
                    </p>

                </div>

            </section>


            {/* PRIVACY & SAFETY */}

            <section className="profile-safety">

                <div className="profile-safety-icon">
                    🛡️
                </div>

                <div>

                    <h2>
                        Privacy & Safety
                    </h2>

                    <p>
                        Keep your personal information private.
                        Use MINEPTHE collection points and follow
                        the safety instructions when collecting
                        books.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => navigate("/safety-analysis")}
                >
                    Safety Center
                </button>

            </section>


            {/* ACTIONS */}

            <section className="profile-actions">

                <button
                    type="button"
                    className="profile-dashboard-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>

                <button
                    type="button"
                    className="profile-logout-button"
                    onClick={handleLogout}
                >
                    Log Out
                </button>

            </section>

        </div>
    );
}

export default Profile;