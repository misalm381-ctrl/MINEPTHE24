const express = require("express");
const { pool } = require("../config/db");
const { matchBooks } = require("../services/bookMatcher");

const router = express.Router();

// GET /api/books
router.get("/", async (req, res) => {
    try {
        const { department, year, search, status } = req.query;

        let query = `
            SELECT
                b.id,
                b.donor_id,
                b.guest_donor_id,
                b.title,
                b.author,
                b.subject,
                b.department,
                b.year,
                b.description,
                b.cover_image,
                b.status,
                b.created_at,
                u.name AS donor_name
            FROM books b
            LEFT JOIN users u ON b.donor_id = u.id
        `;

        const conditions = [];
        const params = [];

        if (status) {
            conditions.push("b.status = ?");
            params.push(status);
        } else {
            // Default: show verified and pending books in library
            conditions.push("b.status IN ('verified', 'pending')");
        }

        if (department) {
            conditions.push("b.department = ?");
            params.push(department);
        }

        if (year) {
            conditions.push("b.year = ?");
            params.push(year);
        }

        if (search) {
            conditions.push("(b.title LIKE ? OR b.author LIKE ? OR b.subject LIKE ?)");
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY b.id DESC";

        const [books] = await pool.execute(query, params);

        res.json({
            success: true,
            books
        });
    } catch (error) {
        console.error("Get books error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to load books."
        });
    }
});

// POST /api/books/match
router.post("/match", async (req, res) => {
    try {
        const { subjects, syllabusText } = req.body;

        const [availableBooks] = await pool.execute(`
            SELECT
                id,
                title,
                author,
                subject,
                department,
                year,
                description,
                cover_image,
                status
            FROM books
            WHERE status IN ('verified', 'pending')
        `);

        const matched = matchBooks(availableBooks, subjects || syllabusText || []);

        res.json({
            success: true,
            matchedBooks: matched
        });
    } catch (error) {
        console.error("Match books error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to calculate book matches."
        });
    }
});

// GET /api/books/:id
router.get("/:id", async (req, res) => {
    try {
        const bookId = Number(req.params.id);

        const [rows] = await pool.execute(
            `SELECT
                b.*,
                u.name AS donor_name,
                u.email AS donor_email,
                g.phone AS guest_phone
             FROM books b
             LEFT JOIN users u ON b.donor_id = u.id
             LEFT JOIN guest_donors g ON b.guest_donor_id = g.id
             WHERE b.id = ?
             LIMIT 1`,
            [bookId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Book not found."
            });
        }

        res.json({
            success: true,
            book: rows[0]
        });
    } catch (error) {
        console.error("Get book error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to load book details."
        });
    }
});

// POST /api/books/donate
router.post("/donate", async (req, res) => {
    try {
        const {
            donorId,
            title,
            author,
            subject,
            department,
            year,
            description,
            coverImage
        } = req.body;

        if (!donorId || !title) {
            return res.status(400).json({
                success: false,
                message: "Donor ID and book title are required."
            });
        }

        const [users] = await pool.execute(
            "SELECT id FROM users WHERE id = ? LIMIT 1",
            [Number(donorId)]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Donor account not found."
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO books
             (donor_id, title, author, subject, department, year, description, cover_image, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                Number(donorId),
                title,
                author || null,
                subject || null,
                department || null,
                year || null,
                description || null,
                coverImage || null
            ]
        );

        // Update reputation
        await pool.execute(
            `INSERT INTO donor_reputation (user_id, verified_books)
             VALUES (?, 0)
             ON DUPLICATE KEY UPDATE verified_books = verified_books + 1, points = points + 5`,
            [Number(donorId)]
        );

        res.status(201).json({
            success: true,
            message: "Book donation submitted successfully.",
            bookId: result.insertId
        });
    } catch (error) {
        console.error("Donation error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to submit donation."
        });
    }
});

// GET /api/users/:userId/donations (also available at /api/books/user/:userId)
router.get("/user/:userId", async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const [books] = await pool.execute(
            "SELECT * FROM books WHERE donor_id = ? ORDER BY id DESC",
            [userId]
        );

        res.json({
            success: true,
            books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to load user donations."
        });
    }
});

module.exports = router;
