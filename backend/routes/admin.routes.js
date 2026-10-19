const express = require("express");
const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const { createAuthToken, requireLogin, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// POST /api/admin/login
router.post("/login", async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Admin email and password are required."
            });
        }

        const [rows] = await pool.execute(
            `SELECT u.id, u.name, u.email, u.password, u.role, a.id AS admin_id
             FROM users u
             INNER JOIN admins a ON a.user_id = u.id
             WHERE u.email = ? AND u.role = 'admin'
             LIMIT 1`,
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin email or credentials."
            });
        }

        const admin = rows[0];
        let passwordMatches = false;

        if (admin.password.startsWith("$2a$") || admin.password.startsWith("$2b$") || admin.password.startsWith("$2y$")) {
            passwordMatches = await bcrypt.compare(password, admin.password);
        } else {
            passwordMatches = (password === admin.password);
        }

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin email or password."
            });
        }

        const token = createAuthToken({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: "admin",
            adminId: admin.admin_id
        });

        res.json({
            success: true,
            message: "Admin login successful.",
            token,
            admin: {
                id: admin.id,
                adminId: admin.admin_id,
                name: admin.name,
                email: admin.email,
                role: "admin"
            }
        });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to process admin login."
        });
    }
});

// GET /api/admin/me
router.get("/me", requireLogin, requireAdmin, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT u.id, u.name, u.email, u.role, a.id AS admin_id
             FROM users u
             INNER JOIN admins a ON a.user_id = u.id
             WHERE u.id = ?
             LIMIT 1`,
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin profile not found."
            });
        }

        res.json({
            success: true,
            admin: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin profile."
        });
    }
});

// Helper for change password
async function handleChangePassword(req, res) {
    try {
        const currentPassword = String(req.body.currentPassword || "");
        const newPassword = String(req.body.newPassword || "");

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required."
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must contain at least 8 characters."
            });
        }

        const [rows] = await pool.execute(
            "SELECT password FROM users WHERE id = ? LIMIT 1",
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin user not found."
            });
        }

        const passwordMatches = await bcrypt.compare(currentPassword, rows[0].password);
        if (!passwordMatches) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        const newHash = await bcrypt.hash(newPassword, 12);
        await pool.execute(
            "UPDATE users SET password = ? WHERE id = ?",
            [newHash, req.user.id]
        );

        res.json({
            success: true,
            message: "Admin password updated successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to update password."
        });
    }
}

router.post("/change-password", requireLogin, requireAdmin, handleChangePassword);
router.patch("/change-password", requireLogin, requireAdmin, handleChangePassword);

// GET /api/admin/books
router.get("/books", requireLogin, requireAdmin, async (req, res) => {
    try {
        const [books] = await pool.execute(`
            SELECT
                b.*,
                u.name AS donor_name,
                u.email AS donor_email,
                g.phone AS guest_phone
            FROM books b
            LEFT JOIN users u ON b.donor_id = u.id
            LEFT JOIN guest_donors g ON b.guest_donor_id = g.id
            ORDER BY b.id DESC
        `);

        res.json({
            success: true,
            books
        });
    } catch (error) {
        console.error("Admin books error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to load admin books."
        });
    }
});

// PATCH /api/admin/books/:id/verify
router.patch("/books/:id/verify", requireLogin, requireAdmin, async (req, res) => {
    try {
        const bookId = Number(req.params.id);
        const status = req.body.status || "verified";

        await pool.execute(
            "UPDATE books SET status = ? WHERE id = ?",
            [status, bookId]
        );

        res.json({
            success: true,
            message: `Book verification updated to ${status}.`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to update book verification."
        });
    }
});

// GET /api/admin/users
router.get("/users", requireLogin, requireAdmin, async (req, res) => {
    try {
        const [users] = await pool.execute(`
            SELECT
                u.id,
                u.name,
                u.email,
                u.role,
                u.created_at,
                r.points,
                r.restricted,
                r.warnings
            FROM users u
            LEFT JOIN donor_reputation r ON r.user_id = u.id
            WHERE u.role != 'admin'
            ORDER BY u.id DESC
        `);

        res.json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to load users."
        });
    }
});

// PATCH /api/admin/users/:id/restrict
router.patch("/users/:id/restrict", requireLogin, requireAdmin, async (req, res) => {
    try {
        const userId = Number(req.params.id);
        await pool.execute(
            "INSERT INTO donor_reputation (user_id, restricted) VALUES (?, 1) ON DUPLICATE KEY UPDATE restricted = 1",
            [userId]
        );
        res.json({
            success: true,
            message: "User restricted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to restrict user."
        });
    }
});

// PATCH /api/admin/users/:id/unrestrict
router.patch("/users/:id/unrestrict", requireLogin, requireAdmin, async (req, res) => {
    try {
        const userId = Number(req.params.id);
        await pool.execute(
            "UPDATE donor_reputation SET restricted = 0 WHERE user_id = ?",
            [userId]
        );
        res.json({
            success: true,
            message: "User unrestricted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to unrestrict user."
        });
    }
});

// GET /api/admin/overview
router.get("/overview", requireLogin, requireAdmin, async (req, res) => {
    try {
        const [[{ total: totalUsers }]] = await pool.query(
            "SELECT COUNT(*) AS total FROM users WHERE role != 'admin'"
        );
        const [[{ total: totalBooks }]] = await pool.query(
            "SELECT COUNT(*) AS total FROM books"
        );
        const [[{ total: verifiedBooks }]] = await pool.query(
            "SELECT COUNT(*) AS total FROM books WHERE status = 'verified'"
        );
        const [[{ total: pendingBooks }]] = await pool.query(
            "SELECT COUNT(*) AS total FROM books WHERE status = 'pending'"
        );
        const [[{ total: totalRequests }]] = await pool.query(
            "SELECT COUNT(*) AS total FROM book_requests"
        );
        const [[{ total: totalReports }]] = await pool.query(
            "SELECT COUNT(*) AS total FROM reports"
        );
        const [[{ total: totalCollectionPoints }]] = await pool.query(
            "SELECT COUNT(*) AS total FROM collection_points"
        );

        res.json({
            success: true,
            overview: {
                totalUsers,
                totalBooks,
                verifiedBooks,
                pendingBooks,
                totalRequests,
                totalReports,
                totalCollectionPoints
            }
        });
    } catch (error) {
        console.error("Admin overview error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to load dashboard overview."
        });
    }
});

module.exports = router;
