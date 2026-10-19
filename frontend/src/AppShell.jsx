import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../app-shell.css";

function AppShell({ children }) {
    const location = useLocation();
    const navigate = useNavigate();

    let user = {};

    try {
        user =
            JSON.parse(
                localStorage.getItem("mineptheUser") || "null"
            ) || {};
    } catch {
        user = {};
    }

    const navigation = [
        {
            section: "MAIN",
            items: [
                {
                    label: "Dashboard",
                    path: "/dashboard"
                },
                {
                    label: "Books",
                    path: "/books"
                },
                {
                    label: "Donate Book",
                    path: "/donate-book"
                },
                {
                    label: "Receive Book",
                    path: "/find-books"
                },
                {
                    label: "Smart Matching",
                    path: "/smart-matching"
                }
            ]
        },

        {
            section: "ACTIVITY",
            items: [
                {
                    label: "My Requests",
                    path: "/my-requests"
                },
                {
                    label: "My Donations",
                    path: "/my-donations"
                },
                {
                    label: "Messages",
                    path: "/messages"
                },
                {
                    label: "Notifications",
                    path: "/notifications"
                }
            ]
        },

        {
            section: "SAFETY",
            items: [
                {
                    label: "Collection Point",
                    path: "/collection-point"
                },
                {
                    label: "Verify Collection",
                    path: "/collection-verification"
                },
                {
                    label: "Safety Center",
                    path: "/safety-analysis"
                }
            ]
        },

        {
            section: "ACCOUNT",
            items: [
                {
                    label: "Profile",
                    path: "/profile"
                }
            ]
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("mineptheLoggedIn");
        localStorage.removeItem("mineptheUser");

        navigate("/login");
    };

    const getPageTitle = () => {
        const path = location.pathname;

        if (path === "/dashboard") {
            return "Dashboard";
        }

        if (path === "/books") {
            return "Book Library";
        }

        if (path.includes("smart-matching")) {
            return "Smart Matching";
        }

        if (path.includes("donate")) {
            return "Donate Book";
        }

        if (path.includes("find-books")) {
            return "Receive Book";
        }

        if (path.includes("my-requests")) {
            return "My Requests";
        }

        if (path.includes("my-donations")) {
            return "My Donations";
        }

        if (path.includes("messages")) {
            return "Messages";
        }

        if (path.includes("notifications")) {
            return "Notifications";
        }

        /*
         * IMPORTANT:
         * Check collection-verification BEFORE collection.
         * Otherwise /collection-verification would incorrectly
         * display "Collection Point".
         */
        if (path.includes("collection-verification")) {
            return "Collection Verification";
        }

        if (path.includes("collection")) {
            return "Collection Point";
        }

        if (path.includes("safety")) {
            return "Safety Center";
        }

        if (path.includes("profile")) {
            return "Profile";
        }

        return "MINEPTHE";
    };

    return (
        <div className="tech-shell">

            {/* =========================================
                SIDEBAR
            ========================================= */}

            <aside className="tech-sidebar">

                {/* BRAND */}

                <div className="tech-brand">

                    <div className="brand-mark">
                        M
                    </div>

                    <div>

                        <div className="brand-name">
                            MINEPTHE
                        </div>

                        <div className="brand-subtitle">
                            SMART BOOK NETWORK
                        </div>

                    </div>

                </div>


                {/* SYSTEM STATUS */}

                <div className="sidebar-system">

                    <span className="system-dot"></span>

                    SYSTEM ONLINE

                </div>


                {/* NAVIGATION */}

                <div className="sidebar-navigation">

                    {navigation.map((group) => (

                        <div
                            className="nav-section"
                            key={group.section}
                        >

                            <div className="nav-section-title">
                                {group.section}
                            </div>


                            {group.items.map((item) => (

                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `tech-nav-link ${
                                            isActive
                                                ? "tech-nav-active"
                                                : ""
                                        }`
                                    }
                                >

                                    <span className="nav-indicator"></span>

                                    <span>
                                        {item.label}
                                    </span>

                                </NavLink>

                            ))}

                        </div>

                    ))}

                </div>


                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">

                    <div className="sidebar-ai-card">

                        <div className="ai-card-label">
                            AI ENGINE
                        </div>

                        <div className="ai-card-status">

                            <span></span>

                            Ready

                        </div>

                        <div className="ai-card-text">
                            Book verification and smart matching
                            services are available.
                        </div>

                    </div>


                    <button
                        className="tech-logout"
                        onClick={handleLogout}
                    >
                        Sign Out
                    </button>

                </div>

            </aside>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <main className="tech-main">

                {/* TOP BAR */}

                <header className="tech-topbar">

                    <div>

                        <div className="topbar-label">
                            MINEPTHE / SYSTEM
                        </div>

                        <h1 className="topbar-title">
                            {getPageTitle()}
                        </h1>

                    </div>


                    <div className="topbar-right">

                        {/* ONLINE STATUS */}

                        <div className="topbar-status">

                            <span></span>

                            ONLINE

                        </div>


                        {/* NOTIFICATIONS */}

                        <button
                            className="notification-button"
                            onClick={() =>
                                navigate("/notifications")
                            }
                            title="Notifications"
                        >
                            🔔
                        </button>


                        {/* USER */}

                        <button
                            className="user-chip"
                            onClick={() =>
                                navigate("/profile")
                            }
                        >

                            <span className="user-avatar">

                                {(user.name || "U")
                                    .charAt(0)
                                    .toUpperCase()}

                            </span>


                            <span>
                                {user.name || "Student"}
                            </span>

                        </button>

                    </div>

                </header>


                {/* PAGE CONTENT */}

                <div className="tech-content">

                    {children}

                </div>

            </main>

        </div>
    );
}

export default AppShell;