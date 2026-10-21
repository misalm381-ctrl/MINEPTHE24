const express = require("express");
const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const { createAuthToken } = require("../middleware/auth");

const router = express.Router();

// POST /api/register
router.post("/register", async (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters."
            });
        }

        const [existing] = await pool.execute(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')",
            [name, email, hashedPassword]
        );

        // Initialize reputation
        await pool.execute(
            "INSERT INTO donor_reputation (user_id) VALUES (?) ON DUPLICATE KEY UPDATE user_id = user_id",
            [result.insertId]
        );

        const user = {
            id: result.insertId,
            name,
            email,
            role: "student"
        };

        const token = createAuthToken(user);

        res.status(201).json({
            success: true,
            message: "Registration successful.",
            token,
            user
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed. Please try again."
        });
    }
});

// POST /api/login
router.post("/login", async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        console.log(`[AUTH] Login attempt for: "${email}"`);

        const [rows] = await pool.execute(
            "SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (rows.length === 0) {
            console.warn(`[AUTH] Login failed: No user found with email "${email}"`);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const user = rows[0];

        // Support both bcrypt and legacy test passwords
        let passwordMatches = false;
        if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$")) {
            passwordMatches = await bcrypt.compare(password, user.password);
        } else {
            passwordMatches = (password === user.password);
        }

        if (!passwordMatches) {
            console.warn(`[AUTH] Login failed: Password mismatch for email "${email}"`);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        console.log(`[AUTH] Login successful for: "${email}" (${user.role})`);
        delete user.password;
        const token = createAuthToken(user);

        res.json({
            success: true,
            message: "Login successful.",
            token,
            user
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed. Please check server and database."
        });
    }
});

module.exports = router;
