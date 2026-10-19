const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

// GET /api/reputation/:userId
router.get("/reputation/:userId", async (req, res) => {
    try {
        const userId = Number(req.params.userId);

        const [rows] = await pool.execute(
            "SELECT * FROM donor_reputation WHERE user_id = ? LIMIT 1",
            [userId]
        );

        const reputation = rows[0] || {
            user_id: userId,
            points: 10,
            successful_donations: 0,
            verified_books: 0,
            successful_handovers: 0,
            warnings: 0,
            restricted: 0,
            blacklisted: 0
        };

        res.json({
            success: true,
            reputation
        });
    } catch (error) {
        console.error("Reputation error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to load reputation."
        });
    }
});

// GET /api/safety/:userId
router.get("/safety/:userId", async (req, res) => {
    try {
        const userId = Number(req.params.userId);

        const [rows] = await pool.execute(
            "SELECT * FROM safety_records WHERE user_id = ? ORDER BY id DESC LIMIT 1",
            [userId]
        );

        const safety = rows[0] || {
            user_id: userId,
            warnings: 0,
            confirmed_violations: 0,
            safety_status: "normal"
        };

        res.json({
            success: true,
            safety
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to load safety record."
        });
    }
});

// POST /api/reports
router.post("/reports", async (req, res) => {
    try {
        const { requestId, reporterId, reason, description, category, evidenceImage } = req.body;

        if (!reporterId || !reason) {
            return res.status(400).json({
                success: false,
                message: "Reporter ID and report reason are required."
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO reports
             (request_id, reporter_id, reason, description, category, evidence_image, status)
             VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [
                requestId ? Number(requestId) : null,
                Number(reporterId),
                reason,
                description || null,
                category || "safety",
                evidenceImage || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Safety report submitted to campus administrators.",
            reportId: result.insertId
        });
    } catch (error) {
        console.error("Report error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to submit report."
        });
    }
});

// POST /api/receiver-verification
router.post("/receiver-verification", async (req, res) => {
    try {
        const { userId, institutionName, idCardImage, course, department, year } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required."
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO student_profiles
             (user_id, institution_name, id_card_image, course, department, year, id_card_verified)
             VALUES (?, ?, ?, ?, ?, ?, 1)
             ON DUPLICATE KEY UPDATE
                 institution_name = VALUES(institution_name),
                 id_card_image = VALUES(id_card_image),
                 course = VALUES(course),
                 department = VALUES(department),
                 year = VALUES(year),
                 id_card_verified = 1`,
            [
                Number(userId),
                institutionName || null,
                idCardImage || null,
                course || null,
                department || null,
                year || null
            ]
        );

        res.status(200).json({
            success: true,
            message: "Student ID verified successfully.",
            profileId: result.insertId || userId
        });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to verify student profile."
        });
    }
});

// GET /api/receiver-verification/:userId
router.get("/receiver-verification/:userId", async (req, res) => {
    try {
        const userId = Number(req.params.userId);

        const [rows] = await pool.execute(
            "SELECT * FROM student_profiles WHERE user_id = ? LIMIT 1",
            [userId]
        );

        res.json({
            success: true,
            verified: rows.length > 0 && rows[0].id_card_verified === 1,
            profile: rows[0] || null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to load student verification status."
        });
    }
});

// GET /api/student-profile/:userId
router.get("/student-profile/:userId", async (req, res) => {
    try {
        const userId = Number(req.params.userId);

        const [rows] = await pool.execute(
            `SELECT sp.*, u.name, u.email
             FROM users u
             LEFT JOIN student_profiles sp ON sp.user_id = u.id
             WHERE u.id = ? LIMIT 1`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User profile not found."
            });
        }

        res.json({
            success: true,
            profile: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to load student profile."
        });
    }
});

module.exports = router;
