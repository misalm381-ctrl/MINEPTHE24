const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

// GET /api/notifications/:userId
router.get("/:userId", async (req, res) => {
    try {
        const userId = Number(req.params.userId);

        const [notifications] = await pool.execute(
            "SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 50",
            [userId]
        );

        res.json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to load notifications."
        });
    }
});

// PATCH /api/notifications/:id/read
router.patch("/:id/read", async (req, res) => {
    try {
        const id = Number(req.params.id);

        await pool.execute(
            "UPDATE notifications SET is_read = 1 WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: "Notification marked as read."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to update notification status."
        });
    }
});

module.exports = router;
