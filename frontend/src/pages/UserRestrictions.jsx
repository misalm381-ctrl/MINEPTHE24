import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserRestrictions() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [reason, setReason] = useState("");
    const [duration, setDuration] = useState("7");

    const [search, setSearch] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem(
                    "mineptheAdminToken"
                );

            if (!token) {
                navigate("/admin-login");
                return;
            }

            const response = await fetch(
                "http://localhost:3000/api/admin/users",
                {
                    method: "GET",
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to load users."
                );
            }

            setUsers(
                Array.isArray(data.users)
                    ? data.users
                    : []
            );

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to load users."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!userId) {
            setError(
                "Please select a user."
            );
            return;
        }

        if (!reason.trim()) {
            setError(
                "Please enter the reason for the restriction."
            );
            return;
        }

        if (
            duration !== "Permanent" &&
            (
                !Number.isInteger(
                    Number(duration)
                ) ||
                Number(duration) <= 0
            )
        ) {
            setError(
                "Please select a valid duration."
            );
            return;
        }

        try {
            setSubmitting(true);

            const token =
                localStorage.getItem(
                    "mineptheAdminToken"
                );

            const status =
                duration === "Permanent"
                    ? "blacklisted"
                    : "restricted";

            const response = await fetch(
                `http://localhost:3000/api/admin/users/${userId}/restrict`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status,
                        reason: reason.trim(),
                        duration:
                            duration === "Permanent"
                                ? null
                                : Number(duration)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to restrict user."
                );
            }

            setMessage(
                data.message ||
                "User restriction created successfully."
            );

            setUserId("");
            setReason("");
            setDuration("7");

            await loadUsers();

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to create restriction."
            );
        } finally {
            setSubmitting(false);
        }
    }

    async function removeRestriction(id) {
        const confirmed =
            window.confirm(
                "Remove this user restriction?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");
            setError("");

            const token =
                localStorage.getItem(
                    "mineptheAdminToken"
                );

            const response = await fetch(
                `http://localhost:3000/api/admin/users/${id}/unrestrict`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to remove restriction."
                );
            }

            setMessage(
                data.message ||
                "Restriction removed successfully."
            );

            await loadUsers();

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to remove restriction."
            );
        }
    }

    const filteredUsers = users.filter(
        (user) => {
            const searchText =
                search
                    .trim()
                    .toLowerCase();

            if (!searchText) {
                return true;
            }

            return (
                String(user.name || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(user.email || "")
                    .toLowerCase()
                    .includes(searchText)
            );
        }
    );

    const restrictedUsers =
        filteredUsers.filter(
            (user) =>
                user.account_status ===
                    "restricted" ||
                user.account_status ===
                    "blacklisted"
        );

    const availableUsers =
        filteredUsers.filter(
            (user) =>
                user.role !== "admin" &&
                user.account_status ===
                    "active"
        );

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: "30px 20px"
            }}
        >
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto"
                }}
            >
                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        padding: "30px",
                        boxShadow:
                            "0 8px 25px rgba(0,0,0,0.08)"
                    }}
                >
                    {/* HEADER */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            gap: "15px",
                            flexWrap: "wrap"
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    margin: 0
                                }}
                            >
                                User Management
                            </h1>

                            <p
                                style={{
                                    color: "#666"
                                }}
                            >
                                Manage MINEPTHE
                                user accounts,
                                restrictions and
                                blacklists.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin-dashboard"
                                )
                            }
                            style={
                                secondaryButton
                            }
                        >
                            Admin Dashboard
                        </button>
                    </div>

                    {/* MESSAGES */}

                    {message && (
                        <div
                            style={{
                                marginTop: "20px",
                                padding: "12px",
                                borderRadius: "8px",
                                background:
                                    "#e8f7ee",
                                color: "#176b3a"
                            }}
                        >
                            {message}
                        </div>
                    )}

                    {error && (
                        <div
                            style={{
                                marginTop: "20px",
                                padding: "12px",
                                borderRadius: "8px",
                                background:
                                    "#fdeaea",
                                color: "#a52222"
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* SEARCH */}

                    <div
                        style={{
                            marginTop: "25px"
                        }}
                    >
                        <label
                            style={labelStyle}
                        >
                            Search Users
                        </label>

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search by name or email"
                            style={inputStyle}
                        />
                    </div>

                    {/* CREATE RESTRICTION */}

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            marginTop: "25px",
                            padding: "20px",
                            background:
                                "#f7f8fa",
                            borderRadius:
                                "12px"
                        }}
                    >
                        <h2>
                            Create Restriction
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: "15px"
                            }}
                        >
                            <div>
                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    User
                                </label>

                                <select
                                    value={userId}
                                    onChange={(
                                        event
                                    ) =>
                                        setUserId(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    style={
                                        inputStyle
                                    }
                                >
                                    <option value="">
                                        Select user
                                    </option>

                                    {availableUsers.map(
                                        (user) => (
                                            <option
                                                key={
                                                    user.id
                                                }
                                                value={
                                                    user.id
                                                }
                                            >
                                                {user.name}{" "}
                                                —{" "}
                                                {
                                                    user.email
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Restriction
                                    Duration
                                </label>

                                <select
                                    value={
                                        duration
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setDuration(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    style={
                                        inputStyle
                                    }
                                >
                                    <option value="1">
                                        1 Day
                                    </option>

                                    <option value="7">
                                        7 Days
                                    </option>

                                    <option value="30">
                                        30 Days
                                    </option>

                                    <option value="Permanent">
                                        Permanent
                                        Blacklist
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop: "15px"
                            }}
                        >
                            <label
                                style={labelStyle}
                            >
                                Reason
                            </label>

                            <textarea
                                value={reason}
                                onChange={(
                                    event
                                ) =>
                                    setReason(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Explain the reason for the restriction"
                                rows="4"
                                style={{
                                    ...inputStyle,
                                    resize: "vertical"
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                marginTop: "15px",
                                padding:
                                    "12px 20px",
                                border: "none",
                                borderRadius:
                                    "8px",
                                background:
                                    "#222",
                                color: "#fff",
                                cursor:
                                    submitting
                                        ? "not-allowed"
                                        : "pointer",
                                fontWeight:
                                    "600"
                            }}
                        >
                            {submitting
                                ? "Applying..."
                                : "Apply Restriction"}
                        </button>
                    </form>

                    {/* ALL USERS */}

                    <section
                        style={{
                            marginTop: "35px"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                gap: "10px",
                                flexWrap:
                                    "wrap"
                            }}
                        >
                            <h2>
                                All Users
                            </h2>

                            <button
                                type="button"
                                onClick={
                                    loadUsers
                                }
                                style={
                                    secondaryButton
                                }
                            >
                                Refresh
                            </button>
                        </div>

                        {loading ? (
                            <div
                                style={{
                                    padding:
                                        "20px",
                                    background:
                                        "#f7f8fa",
                                    borderRadius:
                                        "10px",
                                    color: "#666"
                                }}
                            >
                                Loading users...
                            </div>
                        ) : filteredUsers.length ===
                          0 ? (
                            <div
                                style={{
                                    padding:
                                        "20px",
                                    background:
                                        "#f7f8fa",
                                    borderRadius:
                                        "10px",
                                    color: "#666"
                                }}
                            >
                                No users found.
                            </div>
                        ) : (
                            <div
                                style={{
                                    display:
                                        "grid",
                                    gap: "12px"
                                }}
                            >
                                {filteredUsers.map(
                                    (user) => {
                                        const isAdmin =
                                            user.role ===
                                            "admin";

                                        const isRestricted =
                                            user.account_status ===
                                                "restricted" ||
                                            user.account_status ===
                                                "blacklisted";

                                        return (
                                            <div
                                                key={
                                                    user.id
                                                }
                                                style={{
                                                    border:
                                                        "1px solid #e5e7eb",
                                                    borderRadius:
                                                        "10px",
                                                    padding:
                                                        "18px",
                                                    background:
                                                        "#fff"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        gap:
                                                            "15px",
                                                        flexWrap:
                                                            "wrap"
                                                    }}
                                                >
                                                    <div>
                                                        <strong>
                                                            {
                                                                user.name
                                                            }
                                                        </strong>

                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "6px",
                                                                color:
                                                                    "#666"
                                                            }}
                                                        >
                                                            {
                                                                user.email
                                                            }
                                                        </div>

                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "6px",
                                                                color:
                                                                    "#666",
                                                                fontSize:
                                                                    "14px"
                                                            }}
                                                        >
                                                            Role:{" "}
                                                            {
                                                                user.role
                                                            }
                                                        </div>
                                                    </div>

                                                    <span
                                                        style={{
                                                            padding:
                                                                "6px 10px",
                                                            borderRadius:
                                                                "20px",
                                                            background:
                                                                isAdmin
                                                                    ? "#e8eaf6"
                                                                    : user.account_status ===
                                                                      "blacklisted"
                                                                    ? "#fdeaea"
                                                                    : user.account_status ===
                                                                      "restricted"
                                                                    ? "#fff3cd"
                                                                    : "#e8f7ee",
                                                            color:
                                                                isAdmin
                                                                    ? "#303f9f"
                                                                    : user.account_status ===
                                                                      "blacklisted"
                                                                    ? "#a52222"
                                                                    : user.account_status ===
                                                                      "restricted"
                                                                    ? "#735400"
                                                                    : "#176b3a",
                                                            fontSize:
                                                                "13px",
                                                            fontWeight:
                                                                "600"
                                                        }}
                                                    >
                                                        {isAdmin
                                                            ? "ADMIN"
                                                            : String(
                                                                  user.account_status ||
                                                                      "active"
                                                              ).toUpperCase()}
                                                    </span>
                                                </div>

                                                {user.restriction_reason && (
                                                    <div
                                                        style={{
                                                            marginTop:
                                                                "12px",
                                                            color:
                                                                "#666"
                                                        }}
                                                    >
                                                        <strong>
                                                            Reason:
                                                        </strong>{" "}
                                                        {
                                                            user.restriction_reason
                                                        }
                                                    </div>
                                                )}

                                                {user.restriction_until && (
                                                    <div
                                                        style={{
                                                            marginTop:
                                                                "8px",
                                                            color:
                                                                "#666",
                                                            fontSize:
                                                                "14px"
                                                        }}
                                                    >
                                                        Restricted
                                                        until:{" "}
                                                        {new Date(
                                                            user.restriction_until
                                                        ).toLocaleString()}
                                                    </div>
                                                )}

                                                {!isAdmin &&
                                                    isRestricted && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeRestriction(
                                                                    user.id
                                                                )
                                                            }
                                                            style={{
                                                                marginTop:
                                                                    "15px",
                                                                padding:
                                                                    "9px 14px",
                                                                border:
                                                                    "1px solid #ccc",
                                                                borderRadius:
                                                                    "7px",
                                                                background:
                                                                    "#fff",
                                                                cursor:
                                                                    "pointer",
                                                                fontWeight:
                                                                    "600"
                                                            }}
                                                        >
                                                            Remove
                                                            Restriction
                                                        </button>
                                                    )}

                                                {isAdmin && (
                                                    <div
                                                        style={{
                                                            marginTop:
                                                                "12px",
                                                            color:
                                                                "#666",
                                                            fontSize:
                                                                "14px"
                                                        }}
                                                    >
                                                        The single
                                                        admin account
                                                        cannot be
                                                        restricted.
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </section>

                    {/* SUMMARY */}

                    <section
                        style={{
                            marginTop: "35px"
                        }}
                    >
                        <h2>
                            Restriction Summary
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(180px, 1fr))",
                                gap: "12px"
                            }}
                        >
                            <div
                                style={{
                                    padding: "18px",
                                    background:
                                        "#f7f8fa",
                                    borderRadius:
                                        "10px"
                                }}
                            >
                                <strong>
                                    Total Users
                                </strong>

                                <div
                                    style={{
                                        fontSize:
                                            "28px",
                                        marginTop:
                                            "8px"
                                    }}
                                >
                                    {users.length}
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: "18px",
                                    background:
                                        "#fff3cd",
                                    borderRadius:
                                        "10px"
                                }}
                            >
                                <strong>
                                    Restricted
                                </strong>

                                <div
                                    style={{
                                        fontSize:
                                            "28px",
                                        marginTop:
                                            "8px"
                                    }}
                                >
                                    {
                                        users.filter(
                                            (user) =>
                                                user.account_status ===
                                                "restricted"
                                        ).length
                                    }
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: "18px",
                                    background:
                                        "#fdeaea",
                                    borderRadius:
                                        "10px"
                                }}
                            >
                                <strong>
                                    Blacklisted
                                </strong>

                                <div
                                    style={{
                                        fontSize:
                                            "28px",
                                        marginTop:
                                            "8px"
                                    }}
                                >
                                    {
                                        users.filter(
                                            (user) =>
                                                user.account_status ===
                                                "blacklisted"
                                        ).length
                                    }
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* NOTICE */}

                    <div
                        style={{
                            marginTop: "30px",
                            padding: "16px",
                            borderRadius:
                                "10px",
                            background:
                                "#fff8e5",
                            color: "#735400",
                            lineHeight:
                                "1.5"
                        }}
                    >
                        <strong>
                            Admin Notice
                        </strong>

                        <br />

                        Restrictions should be
                        based on documented
                        reports or rule
                        violations. Restrictions
                        are now stored on the
                        server and are protected
                        by admin authentication.
                    </div>
                </div>
            </div>
        </div>
    );
}

const labelStyle = {
    display: "block",
    fontWeight: "600",
    marginBottom: "7px"
};

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #d6d9e0",
    borderRadius: "8px",
    fontSize: "15px"
};

const secondaryButton = {
    padding: "12px 18px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "600"
};

export default UserRestrictions;