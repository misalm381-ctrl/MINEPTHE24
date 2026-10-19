const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

// GET /api/messages/:requestId
router.get("/:requestId", async (req, res) => {
    try {
        const requestId = Number(req.params.requestId);

        const [rows] = await pool.execute(
            `SELECT m.*, u.name as sender_name
             FROM messages m
             LEFT JOIN users u ON m.sender_id = u.id
             WHERE m.request_id = ?
             ORDER BY m.id ASC`,
            [requestId]
        );

        res.json({
            success: true,
            messages: rows
        });
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to load messages."
        });
    }
});

// POST /api/messages
router.post("/", async (req, res) => {
    try {
        const { requestId, senderId, senderType, message } = req.body;

        if (!requestId || !senderId || !message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Request ID, sender ID, and message text are required."
            });
        }

        const validSenderType = senderType === "donor" ? "donor" : "receiver";

        const [result] = await pool.execute(
            `INSERT INTO messages (request_id, sender_id, sender_type, message)
             VALUES (?, ?, ?, ?)`,
            [Number(requestId), Number(senderId), validSenderType, message.trim()]
        );

        const [rows] = await pool.execute(
            "SELECT * FROM messages WHERE id = ? LIMIT 1",
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            data: rows[0]
        });
    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to send message."
        });
    }
});

module.exports = router;
