const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

// Memory store for OTPs and guest tokens
const otpStore = new Map();
const guestVerificationStore = new Map();

// POST /api/guest/send-otp
router.post("/send-otp", async (req, res) => {
    try {
        const phone = String(req.body.phone || "").trim();

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit phone number."
            });
        }

        const demoOtp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore.set(phone, {
            otp: demoOtp,
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        console.log(`[MINEPTHE] Demo OTP for ${phone}: ${demoOtp}`);

        res.json({
            success: true,
            message: "Demo OTP generated successfully.",
            demoOtp
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send OTP."
        });
    }
});

// POST /api/guest/verify-otp
router.post("/verify-otp", async (req, res) => {
    try {
        const phone = String(req.body.phone || "").trim();
        const otp = String(req.body.otp || "").trim();

        const savedOtp = otpStore.get(phone);

        if (!savedOtp) {
            return res.status(400).json({
                success: false,
                message: "No OTP found. Please generate a new OTP."
            });
        }

        if (Date.now() > savedOtp.expiresAt) {
            otpStore.delete(phone);
            return res.status(400).json({
                success: false,
                message: "OTP expired. Please generate a new OTP."
            });
        }

        if (savedOtp.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP code."
            });
        }

        otpStore.delete(phone);

        const guestEmail = `guest_${Date.now()}_${Math.floor(Math.random() * 100000)}@minepthe.local`;

        const [result] = await pool.execute(
            `INSERT INTO guest_donors (email, phone, phone_verified, verified_at)
             VALUES (?, ?, 1, CURRENT_TIMESTAMP)`,
            [guestEmail, phone]
        );

        const guestDonorId = result.insertId;
        const verificationToken = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 18)}`;

        guestVerificationStore.set(verificationToken, {
            guestDonorId,
            phone,
            expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
        });

        res.json({
            success: true,
            message: "Phone number verified successfully.",
            verificationToken
        });
    } catch (error) {
        console.error("Guest OTP verification error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to verify phone number."
        });
    }
});

// POST /api/guest/donate-book
router.post("/donate-book", async (req, res) => {
    try {
        const verificationToken = String(req.body.verificationToken || "").trim();
        const title = String(req.body.title || "").trim();
        const author = String(req.body.author || "").trim();
        const subject = String(req.body.subject || "").trim();
        const department = String(req.body.department || "").trim();
        const year = String(req.body.year || "").trim();
        const description = String(req.body.description || "").trim();
        const coverImage = req.body.cover_image || req.body.coverImage || null;

        if (!verificationToken || !title) {
            return res.status(400).json({
                success: false,
                message: "Guest verification and book title are required."
            });
        }

        const verification = guestVerificationStore.get(verificationToken);

        if (!verification) {
            return res.status(403).json({
                success: false,
                message: "Guest verification expired. Please verify your phone number again."
            });
        }

        if (Date.now() > verification.expiresAt) {
            guestVerificationStore.delete(verificationToken);
            return res.status(403).json({
                success: false,
                message: "Guest verification session expired. Please verify again."
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO books
             (guest_donor_id, title, author, subject, department, year, description, cover_image, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                verification.guestDonorId,
                title,
                author || null,
                subject || null,
                department || null,
                year || null,
                description || null,
                coverImage
            ]
        );

        res.status(201).json({
            success: true,
            message: "Book donated successfully as guest.",
            bookId: result.insertId
        });
    } catch (error) {
        console.error("Guest donation error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to submit guest book donation."
        });
    }
});

module.exports = router;
