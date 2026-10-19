const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "MINEPTHE_AUTH_SECRET_2026_PRODUCTION";

// In-memory token store for high-performance session tracking
const activeTokens = new Map();

function createAuthToken(user) {
    const token = crypto.randomBytes(32).toString("hex");

    const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminId: user.adminId || user.admin_id || null,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };

    activeTokens.set(token, sessionData);

    return token;
}

function requireLogin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please login."
        });
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization token."
        });
    }

    // 1. Check in-memory store
    const session = activeTokens.get(token);

    if (session) {
        if (Date.now() > session.expiresAt) {
            activeTokens.delete(token);
            return res.status(401).json({
                success: false,
                message: "Session expired. Please login again."
            });
        }

        req.authToken = token;
        req.user = session;
        return next();
    }

    // 2. Fallback check: decode JWT if token was generated via JWT
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.authToken = token;
        req.user = decoded;
        return next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session. Please login again."
        });
    }
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin privilege required. Access denied."
        });
    }

    next();
}

function removeAuthToken(token) {
    if (token) {
        activeTokens.delete(token);
    }
}

module.exports = {
    createAuthToken,
    requireLogin,
    requireAdmin,
    removeAuthToken
};
