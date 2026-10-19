const express = require("express");
const { pool } = require("../config/db");
const requestService = require("../services/requestService");

const router = express.Router();

// POST /api/requests
router.post("/", async (req, res) => {
    try {
        const request = await requestService.createRequest(pool, req.body);

        // Update book status to 'requested'
        await pool.execute(
            "UPDATE books SET status = 'requested' WHERE id = ? AND status IN ('pending', 'verified')",
            [request.book_id]
        );

        // Notify donor
        await pool.execute(
            `INSERT INTO notifications (user_id, message)
             SELECT donor_id, CONCAT('A student requested your book: ', title)
             FROM books
             WHERE id = ? AND donor_id IS NOT NULL`,
            [request.book_id]
        );

        res.status(201).json({
            success: true,
            message: "Book request created successfully.",
            request
        });
    } catch (error) {
        console.error("Create request error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Unable to create request."
        });
    }
});

// GET /api/requests
router.get("/", async (req, res) => {
    try {
        const { requesterId, donorId } = req.query;
        const requests = await requestService.getRequests(pool, requesterId, donorId);

        res.json({
            success: true,
            requests
        });
    } catch (error) {
        console.error("Get requests error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to load requests."
        });
    }
});

// GET /api/requests/:id
router.get("/:id", async (req, res) => {
    try {
        const request = await requestService.getRequestById(pool, req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found."
            });
        }

        res.json({
            success: true,
            request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to load request."
        });
    }
});

// PATCH /api/requests/:id/status
router.patch("/:id/status", async (req, res) => {
    try {
        const status = String(req.body.status || "").trim().toLowerCase();

        const request = await requestService.updateRequestStatus(pool, req.params.id, status);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found."
            });
        }

        if (status === "accepted") {
            await pool.execute(
                "UPDATE books SET status = 'requested' WHERE id = ?",
                [request.book_id]
            );
        } else if (status === "collected") {
            await pool.execute(
                "UPDATE books SET status = 'transferred' WHERE id = ?",
                [request.book_id]
            );
        } else if (status === "rejected") {
            await pool.execute(
                "UPDATE books SET status = 'verified' WHERE id = ?",
                [request.book_id]
            );
        }

        res.json({
            success: true,
            message: "Request status updated successfully.",
            request
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Unable to update request status."
        });
    }
});

// DELETE /api/requests/:id
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await requestService.deleteRequest(pool, req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Request not found or already deleted."
            });
        }

        res.json({
            success: true,
            message: "Request deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to delete request."
        });
    }
});

module.exports = router;
