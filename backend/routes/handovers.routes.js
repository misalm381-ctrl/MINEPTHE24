const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

function generateCollectionCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// GET /api/collection-points
router.get("/collection-points", async (req, res) => {
    try {
        // Return approved or verified points; if none exist, return all points
        let [points] = await pool.execute(
            "SELECT * FROM collection_points WHERE safety_status = 'approved' OR is_verified = 1 ORDER BY name"
        );

        if (points.length === 0) {
            const [allPoints] = await pool.execute(
                "SELECT * FROM collection_points ORDER BY name"
            );
            points = allPoints;
        }

        res.json({
            success: true,
            collectionPoints: points
        });
    } catch (error) {
        console.error("Collection points error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to load collection points."
        });
    }
});

// POST /api/collection-points
router.post("/collection-points", async (req, res) => {
    try {
        const {
            name,
            address,
            latitude,
            longitude,
            contactPerson,
            instructions
        } = req.body;

        if (!name || !address) {
            return res.status(400).json({
                success: false,
                message: "Collection point name and address are required."
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO collection_points
             (name, address, latitude, longitude, contact_person, instructions, is_verified, safety_status)
             VALUES (?, ?, ?, ?, ?, ?, 1, 'approved')`,
            [
                name,
                address,
                latitude || null,
                longitude || null,
                contactPerson || null,
                instructions || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Collection point created and verified successfully.",
            collectionPointId: result.insertId
        });
    } catch (error) {
        console.error("Create collection point error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to create collection point."
        });
    }
});

// POST /api/handovers
router.post("/handovers", async (req, res) => {
    try {
        const requestId = Number(req.body.requestId);

        if (!requestId) {
            return res.status(400).json({
                success: false,
                message: "Request ID is required."
            });
        }

        const [requestRows] = await pool.execute(
            "SELECT id, status FROM book_requests WHERE id = ? LIMIT 1",
            [requestId]
        );

        if (requestRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found."
            });
        }

        const collectionCode = generateCollectionCode();

        const [result] = await pool.execute(
            `INSERT INTO handovers (request_id, status)
             VALUES (?, 'accepted')
             ON DUPLICATE KEY UPDATE status = 'accepted'`,
            [requestId]
        );

        await pool.execute(
            "UPDATE book_requests SET status = 'accepted', collection_code = ? WHERE id = ?",
            [collectionCode, requestId]
        );

        const [rows] = await pool.execute(
            "SELECT * FROM handovers WHERE request_id = ? LIMIT 1",
            [requestId]
        );

        res.status(201).json({
            success: true,
            message: "Handover generated successfully.",
            collectionCode,
            handover: rows[0] || { id: result.insertId }
        });
    } catch (error) {
        console.error("Handover creation error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to create handover."
        });
    }
});

// POST /api/handovers/verify-code
router.post("/handovers/verify-code", async (req, res) => {
    try {
        const requestId = Number(req.body.requestId);
        const collectionCode = String(req.body.collectionCode || "").trim();

        if (!requestId || !collectionCode) {
            return res.status(400).json({
                success: false,
                message: "Request ID and collection code are required."
            });
        }

        const [rows] = await pool.execute(
            "SELECT br.id, br.book_id, br.status, br.collection_code FROM book_requests br WHERE br.id = ? LIMIT 1",
            [requestId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Request not found."
            });
        }

        if (rows[0].collection_code !== collectionCode) {
            return res.status(400).json({
                success: false,
                message: "Invalid collection code."
            });
        }

        await pool.execute(
            `UPDATE handovers
             SET status = 'collected',
                 collection_code_verified = 1,
                 receiver_confirmed = 1,
                 completed_at = CURRENT_TIMESTAMP,
                 verified_at = CURRENT_TIMESTAMP
             WHERE request_id = ?`,
            [requestId]
        );

        await pool.execute(
            "UPDATE book_requests SET status = 'collected' WHERE id = ?",
            [requestId]
        );

        await pool.execute(
            "UPDATE books SET status = 'transferred' WHERE id = ?",
            [rows[0].book_id]
        );

        res.json({
            success: true,
            message: "Collection code verified. Book collection successfully completed!"
        });
    } catch (error) {
        console.error("Collection verification error:", error);
        res.status(500).json({
            success: false,
            message: "Collection verification failed."
        });
    }
});

module.exports = router;
