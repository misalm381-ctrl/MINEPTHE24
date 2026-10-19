require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    createAuthToken,
    requireLogin,
    requireAdmin
} = require("./authMiddleware");

const {
    analyzeBookImage
} = require("./aiBookAnalyzer");

const {
    analyzeSyllabus
} = require("./aiSyllabusAnalyzer");

const {
    matchBooks
} = require("./bookMatcher");

const requestService = require("./requestService");

const app = express();

const PORT = Number(process.env.PORT || 3000);

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "MINEPTHE_ADMIN_SECRET_CHANGE_THIS";


/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());

app.use(
    express.json({
        limit: "15mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "15mb"
    })
);


/* =========================================================
   DATABASE
========================================================= */

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "minepthe",
    port: Number(process.env.DB_PORT || 3306)
};

let db = null;


async function connectDatabase() {
    try {
        db = await mysql.createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        await db.execute("SELECT 1");

        console.log("MySQL connected successfully!");

    } catch (error) {
        console.error("MySQL connection failed:");
        console.error(error.message);

        db = null;
    }
}


function requireDatabase(res) {
    if (!db) {
        res.status(503).json({
            success: false,
            message: "Database is currently unavailable."
        });

        return false;
    }

    return true;
}


/* =========================================================
   HEALTH
========================================================= */

app.get("/", (req, res) => {
    res.json({
        success: true,
        project: "MINEPTHE",
        description:
            "Smart Academic Book Sharing & Matching System",
        motto: "Give - Find - Grow",
        status: "Backend running"
    });
});


app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "MINEPTHE backend API is working."
    });
});


/* =========================================================
   AUTHENTICATION
========================================================= */

app.post("/api/register", async (req, res) => {
    try {
        if (!requireDatabase(res)) {
            return;
        }

        const name =
            String(req.body.name || "").trim();

        const email =
            String(req.body.email || "")
                .trim()
                .toLowerCase();

        const password =
            String(req.body.password || "");

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 6 characters."
            });
        }

        const [existing] = await db.execute(
            `
            SELECT id
            FROM users
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "An account with this email already exists."
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            `
            INSERT INTO users
            (
                name,
                email,
                password,
                role
            )
            VALUES (?, ?, ?, 'student')
            `,
            [
                name,
                email,
                hashedPassword
            ]
        );

        await db.execute(
            `
            INSERT INTO donor_reputation
            (
                user_id
            )
            VALUES (?)
            ON DUPLICATE KEY UPDATE
                user_id = user_id
            `,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Registration successful.",
            user: {
                id: result.insertId,
                name,
                email,
                role: "student"
            }
        });

    } catch (error) {
        console.error("Registration error:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Registration failed."
        });
    }
});


app.post("/api/login", async (req, res) => {
    try {
        if (!requireDatabase(res)) {
            return;
        }

        const email =
            String(req.body.email || "")
                .trim()
                .toLowerCase();

        const password =
            String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required."
            });
        }

        const [rows] = await db.execute(
            `
            SELECT
                id,
                name,
                email,
                password,
                role
            FROM users
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password."
            });
        }

        const user = rows[0];

        const passwordMatches =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password."
            });
        }

        delete user.password;

        const token =
            createAuthToken(user);

        res.json({
            success: true,
            message: "Login successful.",
            token,
            user
        });

    } catch (error) {
        console.error("Login error:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Login failed."
        });
    }
});


/* =========================================================
   SINGLE ADMIN LOGIN
========================================================= */

app.post("/api/admin/login", async (req, res) => {
    try {
        if (!requireDatabase(res)) {
            return;
        }

        const email =
            String(req.body.email || "")
                .trim()
                .toLowerCase();

        const password =
            String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Admin email and password are required."
            });
        }

        const [rows] = await db.execute(
            `
            SELECT
                u.id,
                u.name,
                u.email,
                u.password,
                u.role,
                a.id AS admin_id
            FROM users u
            INNER JOIN admins a
                ON a.user_id = u.id
            WHERE
                u.email = ?
                AND u.role = 'admin'
            LIMIT 1
            `,
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid admin email or password."
            });
        }

        const admin = rows[0];

        const passwordMatches =
            await bcrypt.compare(
                password,
                admin.password
            );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid admin email or password."
            });
        }

        /*
         * Use the same authentication-token
         * system as the rest of MINEPTHE.
         *
         * This keeps requireLogin and requireAdmin
         * compatible with the admin token.
         */

        const token = createAuthToken({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: "admin",
            adminId: admin.admin_id
        });

        res.json({
            success: true,
            message:
                "Admin login successful.",
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
        console.error(
            "Admin login error:"
        );

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Unable to process admin login."
        });
    }
});


/* =========================================================
   ADMIN CHANGE PASSWORD
========================================================= */

app.patch(
    "/api/admin/change-password",
    requireLogin,
    requireAdmin,
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const adminUserId =
                Number(
                    req.user?.id ||
                    req.user?.userId
                );

            const currentPassword =
                String(
                    req.body.currentPassword || ""
                );

            const newPassword =
                String(
                    req.body.newPassword || ""
                );

            if (
                !adminUserId ||
                !currentPassword ||
                !newPassword
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Current password and new password are required."
                });
            }

            if (newPassword.length < 8) {
                return res.status(400).json({
                    success: false,
                    message:
                        "New admin password must contain at least 8 characters."
                });
            }

            const [rows] =
                await db.execute(
                    `
                    SELECT
                        u.id,
                        u.password,
                        u.role
                    FROM users u
                    INNER JOIN admins a
                        ON a.user_id = u.id
                    WHERE
                        u.id = ?
                        AND u.role = 'admin'
                    LIMIT 1
                    `,
                    [adminUserId]
                );

            if (rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Admin account not found."
                });
            }

            const passwordMatches =
                await bcrypt.compare(
                    currentPassword,
                    rows[0].password
                );

            if (!passwordMatches) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Current admin password is incorrect."
                });
            }

            const samePassword =
                await bcrypt.compare(
                    newPassword,
                    rows[0].password
                );

            if (samePassword) {
                return res.status(400).json({
                    success: false,
                    message:
                        "New password must be different from the current password."
                });
            }

            const newHash =
                await bcrypt.hash(
                    newPassword,
                    12
                );

            await db.execute(
                `
                UPDATE users
                SET password = ?
                WHERE id = ?
                  AND role = 'admin'
                `,
                [
                    newHash,
                    adminUserId
                ]
            );

            res.json({
                success: true,
                message:
                    "Admin password changed successfully. Please log in again."
            });

        } catch (error) {
            console.error(
                "Admin password change error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to change admin password."
            });
        }
    }
);


/* =========================================================
   ADMIN INFORMATION
========================================================= */

app.get(
    "/api/admin/me",
    requireLogin,
    requireAdmin,
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const adminUserId =
                Number(
                    req.user?.id ||
                    req.user?.userId
                );

            const [rows] =
                await db.execute(
                    `
                    SELECT
                        u.id,
                        u.name,
                        u.email,
                        u.role,
                        a.id AS admin_id,
                        a.created_at
                    FROM users u
                    INNER JOIN admins a
                        ON a.user_id = u.id
                    WHERE
                        u.id = ?
                        AND u.role = 'admin'
                    LIMIT 1
                    `,
                    [adminUserId]
                );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Admin account not found."
                });
            }

            res.json({
                success: true,
                admin: {
                    id: rows[0].id,
                    adminId:
                        rows[0].admin_id,
                    name:
                        rows[0].name,
                    email:
                        rows[0].email,
                    role:
                        rows[0].role,
                    createdAt:
                        rows[0].created_at
                }
            });

        } catch (error) {
            console.error(
                "Admin information error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load admin information."
            });
        }
    }
);


/* =========================================================
   GUEST OTP
========================================================= */

const otpStore = new Map();
const guestVerificationStore = new Map();


app.post(
    "/api/guest/send-otp",
    async (req, res) => {
        const phone =
            String(req.body.phone || "").trim();

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid 10-digit phone number."
            });
        }

        const demoOtp =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();

        otpStore.set(phone, {
            otp: demoOtp,
            expiresAt:
                Date.now() +
                5 * 60 * 1000
        });

        console.log(
            "MINEPTHE demo OTP generated for guest donation."
        );

        res.json({
            success: true,
            message:
                "Demo OTP generated successfully.",
            demoOtp
        });
    }
);


app.post(
    "/api/guest/verify-otp",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const phone =
                String(
                    req.body.phone || ""
                ).trim();

            const otp =
                String(
                    req.body.otp || ""
                ).trim();

            const savedOtp =
                otpStore.get(phone);

            if (!savedOtp) {
                return res.status(400).json({
                    success: false,
                    message:
                        "No OTP found. Please generate a new OTP."
                });
            }

            if (
                Date.now() >
                savedOtp.expiresAt
            ) {
                otpStore.delete(phone);

                return res.status(400).json({
                    success: false,
                    message:
                        "OTP expired. Please generate a new OTP."
                });
            }

            if (savedOtp.otp !== otp) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid OTP."
                });
            }

            otpStore.delete(phone);

            const guestEmail =
                "guest_" +
                Date.now() +
                "_" +
                Math.floor(
                    Math.random() * 100000
                ) +
                "@minepthe.local";

            const [result] =
                await db.execute(
                    `
                    INSERT INTO guest_donors
                    (
                        email,
                        phone,
                        phone_verified,
                        verified_at
                    )
                    VALUES (?, NULL, 1, CURRENT_TIMESTAMP)
                    `,
                    [guestEmail]
                );

            const guestDonorId =
                result.insertId;

            const verificationToken =
                "guest_" +
                Date.now() +
                "_" +
                Math.random()
                    .toString(36)
                    .substring(2, 18);

            guestVerificationStore.set(
                verificationToken,
                {
                    guestDonorId,
                    expiresAt:
                        Date.now() +
                        30 * 60 * 1000
                }
            );

            res.json({
                success: true,
                message:
                    "Phone number verified successfully.",
                verificationToken
            });

        } catch (error) {
            console.error(
                "Guest OTP verification error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to verify phone number."
            });
        }
    }
);


app.post(
    "/api/guest/donate-book",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const verificationToken =
                String(
                    req.body.verificationToken || ""
                ).trim();

            const title =
                String(
                    req.body.title || ""
                ).trim();

            const author =
                String(
                    req.body.author || ""
                ).trim();

            const subject =
                String(
                    req.body.subject || ""
                ).trim();

            const description =
                String(
                    req.body.description || ""
                ).trim();

            const coverImage =
                req.body.cover_image || null;

            if (
                !verificationToken ||
                !title
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Guest verification and book title are required."
                });
            }

            const verification =
                guestVerificationStore.get(
                    verificationToken
                );

            if (!verification) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Guest verification expired. Please verify your phone number again."
                });
            }

            if (
                Date.now() >
                verification.expiresAt
            ) {
                guestVerificationStore.delete(
                    verificationToken
                );

                return res.status(403).json({
                    success: false,
                    message:
                        "Guest verification expired. Please verify your phone number again."
                });
            }

            const guestDonorId =
                verification.guestDonorId;

            const [result] =
                await db.execute(
                    `
                    INSERT INTO books
                    (
                        title,
                        author,
                        subject,
                        description,
                        cover_image,
                        status,
                        guest_donor_id
                    )
                    VALUES (?, ?, ?, ?, ?, 'pending', ?)
                    `,
                    [
                        title,
                        author || null,
                        subject || null,
                        description || null,
                        coverImage,
                        guestDonorId
                    ]
                );

            guestVerificationStore.delete(
                verificationToken
            );

            res.status(201).json({
                success: true,
                message:
                    "Guest book donation submitted successfully.",
                bookId:
                    result.insertId
            });

        } catch (error) {
            console.error(
                "Guest donation error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to submit guest donation."
            });
        }
    }
);


/* =========================================================
   BOOKS
========================================================= */

app.get(
    "/api/books",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const [rows] =
                await db.execute(
                    `
                    SELECT
                        id,
                        donor_id,
                        guest_donor_id,
                        title,
                        author,
                        subject,
                        department,
                        year,
                        description,
                        cover_image,
                        status,
                        created_at
                    FROM books
                    ORDER BY created_at DESC
                    `
                );

            res.json({
                success: true,
                books: rows
            });

        } catch (error) {
            console.error(
                "Get books error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load books."
            });
        }
    }
);


app.get(
    "/api/books/:id",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const bookId =
                Number(
                    req.params.id
                );

            if (!bookId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Book ID is required."
                });
            }

            const [rows] =
                await db.execute(
                    `
                    SELECT
                        id,
                        donor_id,
                        guest_donor_id,
                        title,
                        author,
                        subject,
                        department,
                        year,
                        description,
                        cover_image,
                        status,
                        created_at
                    FROM books
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [bookId]
                );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Book not found."
                });
            }

            res.json({
                success: true,
                book: rows[0]
            });

        } catch (error) {
            console.error(
                "Get book error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load book."
            });
        }
    }
);


/* =========================================================
   AI BOOK ANALYSIS
========================================================= */

app.post(
    "/api/ai/analyze-book",
    async (req, res) => {
        try {
            const {
                image,
                title,
                author,
                subject
            } = req.body;

            if (
                !image &&
                !title &&
                !author &&
                !subject
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Book image or book details are required."
                });
            }

            const result =
                await analyzeBookImage(
                    image || null
                );

            res.json({
                success: true,
                analysis: result
            });

        } catch (error) {
            console.error(
                "AI book analysis error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to analyze the book."
            });
        }
    }
);


/* =========================================================
   AI SYLLABUS ANALYSIS
========================================================= */

app.post(
    "/api/ai/analyze-syllabus",
    async (req, res) => {
        try {
            const {
                syllabus,
                text,
                image
            } = req.body;

            const syllabusInput =
                syllabus ||
                text ||
                image;

            if (!syllabusInput) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Syllabus text or image is required."
                });
            }

            const result =
                await analyzeSyllabus(
                    syllabusInput
                );

            res.json({
                success: true,
                analysis: result
            });

        } catch (error) {
            console.error(
                "AI syllabus analysis error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to analyze syllabus."
            });
        }
    }
);


/* =========================================================
   SMART BOOK MATCHING
========================================================= */

app.post(
    "/api/books/match",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const studentSubjects =
                Array.isArray(
                    req.body.studentSubjects
                )
                    ? req.body.studentSubjects
                    : String(
                        req.body.studentSubjects || ""
                    )
                        .split(",")
                        .map(
                            (item) =>
                                item.trim()
                        )
                        .filter(Boolean);

            if (
                studentSubjects.length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Student subjects are required."
                });
            }

            const [books] =
                await db.execute(
                    `
                    SELECT
                        id,
                        donor_id,
                        guest_donor_id,
                        title,
                        author,
                        subject,
                        department,
                        year,
                        description,
                        cover_image,
                        status,
                        created_at
                    FROM books
                    WHERE status IN
                        ('pending', 'verified', 'requested')
                    ORDER BY created_at DESC
                    `
                );

            const matchedBooks =
                matchBooks(
                    books.map(
                        (book) => ({
                            ...book,
                            available:
                                book.status !==
                                "transferred"
                        })
                    ),
                    studentSubjects
                );

            res.json({
                success: true,
                subjects:
                    studentSubjects,
                count:
                    matchedBooks.length,
                books:
                    matchedBooks
            });

        } catch (error) {
            console.error(
                "Smart book matching error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to match books."
            });
        }
    }
);


/* =========================================================
   REGISTERED BOOK DONATION
========================================================= */

app.post(
    "/api/books/donate",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

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
                    message:
                        "Donor ID and book title are required."
                });
            }

            const [users] =
                await db.execute(
                    `
                    SELECT id
                    FROM users
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [Number(donorId)]
                );

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Donor account not found."
                });
            }

            const [result] =
                await db.execute(
                    `
                    INSERT INTO books
                    (
                        donor_id,
                        title,
                        author,
                        subject,
                        department,
                        year,
                        description,
                        cover_image,
                        status
                    )
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
                    `,
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

            await db.execute(
                `
                INSERT INTO donor_reputation
                (
                    user_id,
                    verified_books
                )
                VALUES (?, 0)
                ON DUPLICATE KEY UPDATE
                    user_id = user_id
                `,
                [Number(donorId)]
            );

            res.status(201).json({
                success: true,
                message:
                    "Book donation submitted successfully.",
                bookId:
                    result.insertId
            });

        } catch (error) {
            console.error(
                "Donation error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to submit donation."
            });
        }
    }
);


/* =========================================================
   MY DONATIONS
========================================================= */

app.get(
    "/api/users/:userId/donations",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const userId =
                Number(
                    req.params.userId
                );

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "User ID is required."
                });
            }

            const [books] =
                await db.execute(
                    `
                    SELECT *
                    FROM books
                    WHERE donor_id = ?
                    ORDER BY id DESC
                    `,
                    [userId]
                );

            res.json({
                success: true,
                books
            });

        } catch (error) {
            console.error(
                "My donations error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load donations."
            });
        }
    }
);


/* =========================================================
   BOOK REQUESTS - CREATE
========================================================= */

app.post(
    "/api/requests",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const request =
                await requestService.createRequest(
                    db,
                    req.body
                );

            await db.execute(
                `
                UPDATE books
                SET status = 'requested'
                WHERE id = ?
                  AND status IN
                    ('pending', 'verified')
                `,
                [request.book_id]
            );

            await db.execute(
                `
                INSERT INTO notifications
                (
                    user_id,
                    message
                )
                SELECT
                    donor_id,
                    CONCAT(
                        'A student requested your book: ',
                        title
                    )
                FROM books
                WHERE id = ?
                  AND donor_id IS NOT NULL
                `,
                [request.book_id]
            );

            res.status(201).json({
                success: true,
                message:
                    "Book request created successfully.",
                request
            });

        } catch (error) {
            console.error(
                "Create request error:"
            );

            console.error(error);

            res.status(400).json({
                success: false,
                message:
                    error.message ||
                    "Unable to create request."
            });
        }
    }
);


/* =========================================================
   BOOK REQUESTS - GET
========================================================= */

app.get(
    "/api/requests",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const requesterId =
                req.query.requesterId
                    ? Number(
                        req.query.requesterId
                    )
                    : null;

            const donorId =
                req.query.donorId
                    ? Number(
                        req.query.donorId
                    )
                    : null;

            const requests =
                await requestService.getRequests(
                    db,
                    requesterId,
                    donorId
                );

            res.json({
                success: true,
                requests
            });

        } catch (error) {
            console.error(
                "Get requests error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load requests."
            });
        }
    }
);


/* =========================================================
   SINGLE REQUEST
========================================================= */

app.get(
    "/api/requests/:id",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const request =
                await requestService
                    .getRequestById(
                        db,
                        req.params.id
                    );

            if (!request) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Request not found."
                });
            }

            res.json({
                success: true,
                request
            });

        } catch (error) {
            console.error(
                "Get request error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load request."
            });
        }
    }
);


/* =========================================================
   REQUEST STATUS
========================================================= */

app.patch(
    "/api/requests/:id/status",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const status =
                String(
                    req.body.status || ""
                )
                    .trim()
                    .toLowerCase();

            if (
                ![
                    "pending",
                    "accepted",
                    "rejected",
                    "collected",
                    "reported"
                ].includes(status)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid request status."
                });
            }

            const request =
                await requestService
                    .updateRequestStatus(
                        db,
                        req.params.id,
                        status
                    );

            if (!request) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Request not found."
                });
            }

            if (status === "accepted") {
                await db.execute(
                    `
                    UPDATE books
                    SET status = 'requested'
                    WHERE id = ?
                    `,
                    [request.book_id]
                );
            }

            if (status === "collected") {
                await db.execute(
                    `
                    UPDATE books
                    SET status = 'transferred'
                    WHERE id = ?
                    `,
                    [request.book_id]
                );
            }

            res.json({
                success: true,
                message:
                    "Request status updated successfully.",
                request
            });

        } catch (error) {
            console.error(
                "Update request status error:"
            );

            console.error(error);

            res.status(400).json({
                success: false,
                message:
                    error.message ||
                    "Unable to update request."
            });
        }
    }
);


/* =========================================================
   DELETE REQUEST
========================================================= */

app.delete(
    "/api/requests/:id",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const deleted =
                await requestService
                    .deleteRequest(
                        db,
                        req.params.id
                    );

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Request not found."
                });
            }

            res.json({
                success: true,
                message:
                    "Request deleted successfully."
            });

        } catch (error) {
            console.error(
                "Delete request error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to delete request."
            });
        }
    }
);


/* =========================================================
   COLLECTION POINTS
========================================================= */

app.get(
    "/api/collection-points",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const [points] =
                await db.execute(
                    `
                    SELECT *
                    FROM collection_points
                    WHERE safety_status = 'approved'
                    ORDER BY name
                    `
                );

            res.json({
                success: true,
                collectionPoints:
                    points
            });

        } catch (error) {
            console.error(
                "Collection points error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load collection points."
            });
        }
    }
);


app.post(
    "/api/collection-points",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

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
                    message:
                        "Collection point name and address are required."
                });
            }

            const [result] =
                await db.execute(
                    `
                    INSERT INTO collection_points
                    (
                        name,
                        address,
                        latitude,
                        longitude,
                        contact_person,
                        instructions,
                        is_verified,
                        safety_status
                    )
                    VALUES
                    (?, ?, ?, ?, ?, ?, 0, 'pending')
                    `,
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
                message:
                    "Collection point submitted for safety review.",
                collectionPointId:
                    result.insertId
            });

        } catch (error) {
            console.error(
                "Create collection point error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to create collection point."
            });
        }
    }
);


/* =========================================================
   HANDOVERS / COLLECTION CODE
========================================================= */

function generateCollectionCode() {
    return Math.floor(
        100000 +
        Math.random() * 900000
    ).toString();
}


app.post(
    "/api/handovers",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const requestId =
                Number(
                    req.body.requestId
                );

            if (!requestId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Request ID is required."
                });
            }

            const [requestRows] =
                await db.execute(
                    `
                    SELECT
                        id,
                        status
                    FROM book_requests
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [requestId]
                );

            if (requestRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Request not found."
                });
            }

            const collectionCode =
                generateCollectionCode();

            const [result] =
                await db.execute(
                    `
                    INSERT INTO handovers
                    (
                        request_id,
                        status
                    )
                    VALUES
                    (?, 'accepted')
                    ON DUPLICATE KEY UPDATE
                        status = 'accepted'
                    `,
                    [requestId]
                );

            await db.execute(
                `
                UPDATE book_requests
                SET
                    status = 'accepted',
                    collection_code = ?
                WHERE id = ?
                `,
                [
                    collectionCode,
                    requestId
                ]
            );

            const [rows] =
                await db.execute(
                    `
                    SELECT *
                    FROM handovers
                    WHERE request_id = ?
                    LIMIT 1
                    `,
                    [requestId]
                );

            res.status(201).json({
                success: true,
                message:
                    "Handover created successfully.",
                collectionCode,
                handover:
                    rows[0] || {
                        id:
                            result.insertId
                    }
            });

        } catch (error) {
            console.error(
                "Handover creation error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to create handover."
            });
        }
    }
);


app.post(
    "/api/handovers/verify-code",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const requestId =
                Number(
                    req.body.requestId
                );

            const collectionCode =
                String(
                    req.body.collectionCode || ""
                ).trim();

            if (
                !requestId ||
                !collectionCode
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Request ID and collection code are required."
                });
            }

            const [rows] =
                await db.execute(
                    `
                    SELECT
                        br.id,
                        br.book_id,
                        br.status,
                        br.collection_code
                    FROM book_requests br
                    WHERE br.id = ?
                    LIMIT 1
                    `,
                    [requestId]
                );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Request not found."
                });
            }

            if (
                rows[0].collection_code !==
                collectionCode
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid collection code."
                });
            }

            await db.execute(
                `
                UPDATE handovers
                SET
                    status = 'collected',
                    collection_code_verified = 1,
                    receiver_confirmed = 1,
                    completed_at = CURRENT_TIMESTAMP,
                    verified_at = CURRENT_TIMESTAMP
                WHERE request_id = ?
                `,
                [requestId]
            );

            await db.execute(
                `
                UPDATE book_requests
                SET status = 'collected'
                WHERE id = ?
                `,
                [requestId]
            );

            await db.execute(
                `
                UPDATE books
                SET status = 'transferred'
                WHERE id = ?
                `,
                [rows[0].book_id]
            );

            res.json({
                success: true,
                message:
                    "Collection code verified. Book collection completed."
            });

        } catch (error) {
            console.error(
                "Collection verification error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Collection verification failed."
            });
        }
    }
);


/* =========================================================
   NOTIFICATIONS
========================================================= */

app.get(
    "/api/notifications/:userId",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const userId =
                Number(
                    req.params.userId
                );

            const [rows] =
                await db.execute(
                    `
                    SELECT *
                    FROM notifications
                    WHERE user_id = ?
                    ORDER BY id DESC
                    `,
                    [userId]
                );

            res.json({
                success: true,
                notifications:
                    rows
            });

        } catch (error) {
            console.error(
                "Get notifications error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load notifications."
            });
        }
    }
);


app.patch(
    "/api/notifications/:id/read",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            await db.execute(
                `
                UPDATE notifications
                SET is_read = 1
                WHERE id = ?
                `,
                [req.params.id]
            );

            res.json({
                success: true,
                message:
                    "Notification marked as read."
            });

        } catch (error) {
            console.error(
                "Notification update error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to update notification."
            });
        }
    }
);


/* =========================================================
   MESSAGES
========================================================= */

app.get(
    "/api/messages/:requestId",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const [rows] =
                await db.execute(
                    `
                    SELECT *
                    FROM messages
                    WHERE request_id = ?
                    ORDER BY id ASC
                    `,
                    [req.params.requestId]
                );

            res.json({
                success: true,
                messages:
                    rows
            });

        } catch (error) {
            console.error(
                "Get messages error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load messages."
            });
        }
    }
);


app.post(
    "/api/messages",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const {
                requestId,
                senderId,
                senderType,
                message
            } = req.body;

            const cleanMessage =
                String(
                    message || ""
                ).trim();

            if (
                !requestId ||
                !senderType ||
                !cleanMessage
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Request, sender type and message are required."
                });
            }

            if (
                ![
                    "receiver",
                    "donor"
                ].includes(senderType)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid sender type."
                });
            }

            const [result] =
                await db.execute(
                    `
                    INSERT INTO messages
                    (
                        request_id,
                        sender_id,
                        sender_type,
                        message
                    )
                    VALUES (?, ?, ?, ?)
                    `,
                    [
                        Number(requestId),
                        senderId
                            ? Number(senderId)
                            : null,
                        senderType,
                        cleanMessage
                    ]
                );

            const [rows] =
                await db.execute(
                    `
                    SELECT *
                    FROM messages
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [result.insertId]
                );

            res.status(201).json({
                success: true,
                message:
                    rows[0]
            });

        } catch (error) {
            console.error(
                "Send message error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to send message."
            });
        }
    }
);


/* =========================================================
   REPORTS / SAFETY
========================================================= */

app.post(
    "/api/reports",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const {
                requestId,
                reporterId,
                reason,
                description,
                category,
                evidenceImage
            } = req.body;

            if (
                !requestId ||
                !reporterId ||
                !reason
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Request ID, reporter ID and reason are required."
                });
            }

            const [result] =
                await db.execute(
                    `
                    INSERT INTO reports
                    (
                        request_id,
                        reporter_id,
                        reason,
                        description,
                        category,
                        evidence_image
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                    `,
                    [
                        Number(requestId),
                        Number(reporterId),
                        reason,
                        description || null,
                        category || null,
                        evidenceImage || null
                    ]
                );

            await db.execute(
                `
                UPDATE book_requests
                SET
                    status = 'reported',
                    safety_issue_status = 'reported'
                WHERE id = ?
                `,
                [requestId]
            );

            res.status(201).json({
                success: true,
                message:
                    "Safety report submitted successfully.",
                reportId:
                    result.insertId
            });

        } catch (error) {
            console.error(
                "Report error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to submit report."
            });
        }
    }
);


/* =========================================================
   REPUTATION
========================================================= */

app.get(
    "/api/reputation/:userId",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const userId =
                Number(
                    req.params.userId
                );

            const [rows] =
                await db.execute(
                    `
                    SELECT *
                    FROM donor_reputation
                    WHERE user_id = ?
                    LIMIT 1
                    `,
                    [userId]
                );

            res.json({
                success: true,
                reputation:
                    rows[0] || {
                        user_id:
                            userId,
                        points: 0,
                        successful_donations: 0,
                        verified_books: 0,
                        successful_handovers: 0,
                        warnings: 0,
                        restricted: 0,
                        blacklisted: 0
                    }
            });

        } catch (error) {
            console.error(
                "Reputation error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load reputation."
            });
        }
    }
);


/* =========================================================
   SAFETY
========================================================= */

app.get(
    "/api/safety/:userId",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const userId =
                Number(
                    req.params.userId
                );

            const [rows] =
                await db.execute(
                    `
                    SELECT *
                    FROM safety_records
                    WHERE user_id = ?
                    ORDER BY id DESC
                    LIMIT 1
                    `,
                    [userId]
                );

            res.json({
                success: true,
                safety:
                    rows[0] || {
                        user_id:
                            userId,
                        warnings: 0,
                        confirmed_violations: 0,
                        safety_status:
                            "normal"
                    }
            });

        } catch (error) {
            console.error(
                "Safety error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load safety record."
            });
        }
    }
);


/* =========================================================
   RECEIVER VERIFICATION
========================================================= */

app.post(
    "/api/receiver-verification",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const userId =
                Number(
                    req.body.userId
                );

            const institutionName =
                String(
                    req.body.institutionName ||
                    ""
                ).trim();

            const idCardImage =
                String(
                    req.body.idCardImage ||
                    ""
                ).trim();

            if (
                !userId ||
                !institutionName ||
                !idCardImage
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "User ID, college/school name and ID-card image are required."
                });
            }

            const [users] =
                await db.execute(
                    `
                    SELECT id
                    FROM users
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [userId]
                );

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "User not found."
                });
            }

            const [existing] =
                await db.execute(
                    `
                    SELECT id
                    FROM student_profiles
                    WHERE user_id = ?
                    LIMIT 1
                    `,
                    [userId]
                );

            if (existing.length > 0) {
                await db.execute(
                    `
                    UPDATE student_profiles
                    SET
                        institution_name = ?,
                        id_card_image = ?,
                        id_card_verified = 0
                    WHERE user_id = ?
                    `,
                    [
                        institutionName,
                        idCardImage,
                        userId
                    ]
                );
            } else {
                await db.execute(
                    `
                    INSERT INTO student_profiles
                    (
                        user_id,
                        institution_name,
                        id_card_image,
                        id_card_verified
                    )
                    VALUES (?, ?, ?, 0)
                    `,
                    [
                        userId,
                        institutionName,
                        idCardImage
                    ]
                );
            }

            res.status(201).json({
                success: true,
                message:
                    "Receiver verification submitted successfully.",
                verification: {
                    userId,
                    institutionName,
                    idCardVerified:
                        false
                }
            });

        } catch (error) {
            console.error(
                "Receiver verification error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to submit receiver verification."
            });
        }
    }
);


app.get(
    "/api/receiver-verification/:userId",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const userId =
                Number(
                    req.params.userId
                );

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "User ID is required."
                });
            }

            const [rows] =
                await db.execute(
                    `
                    SELECT
                        id,
                        user_id,
                        institution_name,
                        id_card_image,
                        id_card_verified,
                        created_at
                    FROM student_profiles
                    WHERE user_id = ?
                    LIMIT 1
                    `,
                    [userId]
                );

            if (rows.length === 0) {
                return res.json({
                    success: true,
                    verified: false,
                    verification: null
                });
            }

            res.json({
                success: true,
                verified:
                    Boolean(
                        rows[0]
                            .id_card_verified
                    ),
                verification:
                    rows[0]
            });

        } catch (error) {
            console.error(
                "Get receiver verification error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load receiver verification."
            });
        }
    }
);


/* =========================================================
   STUDENT PROFILE
========================================================= */

app.get(
    "/api/student-profile/:userId",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const userId =
                Number(
                    req.params.userId
                );

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "User ID is required."
                });
            }

            const [rows] =
                await db.execute(
                    `
                    SELECT
                        id,
                        user_id,
                        institution_name,
                        college,
                        course,
                        department,
                        year,
                        division,
                        syllabus,
                        id_card_verified
                    FROM student_profiles
                    WHERE user_id = ?
                    LIMIT 1
                    `,
                    [userId]
                );

            if (rows.length === 0) {
                return res.json({
                    success: true,
                    profile: null
                });
            }

            res.json({
                success: true,
                profile:
                    rows[0]
            });

        } catch (error) {
            console.error(
                "Get student profile error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load student profile."
            });
        }
    }
);

/* =========================================================
   ADMIN - ALL BOOKS
========================================================= */

app.get(
    "/api/admin/books",
    requireLogin,
    requireAdmin,
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const [rows] = await db.execute(
                `
                SELECT
                    b.id,
                    b.title,
                    b.author,
                    b.subject,
                    b.department,
                    b.year,
                    b.description,
                    b.cover_image,
                    b.status,
                    b.created_at,
                    b.donor_id,
                    b.guest_donor_id,
                    u.name AS donor_name,
                    u.email AS donor_email
                FROM books b
                LEFT JOIN users u
                    ON b.donor_id = u.id
                ORDER BY b.created_at DESC
                `
            );

            res.json({
                success: true,
                books: rows
            });

        } catch (error) {
            console.error(
                "Admin get books error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load admin books."
            });
        }
    }
);
/* =========================================================
   ADMIN - BOOK VERIFICATION
========================================================= */

app.patch(
    "/api/admin/books/:id/verify",
    requireLogin,
    requireAdmin,
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const bookId =
                Number(req.params.id);

            const [bookRows] =
                await db.execute(
                    `
                    SELECT
                        id,
                        donor_id,
                        status
                    FROM books
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [bookId]
                );

            if (bookRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Book not found."
                });
            }

            await db.execute(
                `
                UPDATE books
                SET status = 'verified'
                WHERE id = ?
                `,
                [bookId]
            );

            if (
                bookRows[0].donor_id
            ) {
                await db.execute(
                    `
                    INSERT INTO donor_reputation
                    (
                        user_id,
                        verified_books,
                        points
                    )
                    VALUES (?, 1, 10)
                    ON DUPLICATE KEY UPDATE
                        verified_books =
                            verified_books + 1,
                        points =
                            points + 10
                    `,
                    [bookRows[0].donor_id]
                );
            }

            res.json({
                success: true,
                message:
                    "Book verified successfully."
            });

        } catch (error) {
            console.error(
                "Admin book verification error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to verify book."
            });
        }
    }
);

/* =========================================================
   ADMIN - LOGIN
========================================================= */

app.post(
    "/api/admin/login",
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const email =
                String(
                    req.body.email || ""
                )
                .trim()
                .toLowerCase();

            const password =
                String(
                    req.body.password || ""
                );

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Admin email and password are required."
                });
            }

            const [rows] =
                await db.execute(
                    `
                    SELECT
                        u.id,
                        u.name,
                        u.email,
                        u.password,
                        u.role,
                        a.id AS admin_id
                    FROM users u
                    INNER JOIN admins a
                        ON a.user_id = u.id
                    WHERE
                        LOWER(u.email) = ?
                        AND u.role = 'admin'
                    LIMIT 1
                    `,
                    [email]
                );

            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Invalid admin email or password."
                });
            }

            const admin = rows[0];

            const passwordMatches =
                await bcrypt.compare(
                    password,
                    admin.password
                );

            if (!passwordMatches) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Invalid admin email or password."
                });
            }

            /*
             * Use the existing MINEPTHE authentication
             * system so this token also works with
             * requireLogin and requireAdmin.
             */
            const token =
                createAuthToken({
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    role: "admin",
                    adminId: admin.admin_id
                });

            res.json({
                success: true,
                message:
                    "Admin login successful.",
                token,
                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    role: "admin",
                    adminId:
                        admin.admin_id
                }
            });

        } catch (error) {
            console.error(
                "Admin login error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to process admin login."
            });
        }
    }
);

// =========================================================
// ADMIN USER MANAGEMENT
// =========================================================

// Get all users
app.get(
    "/api/admin/users",
    requireLogin,
    requireAdmin,
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const [rows] = await db.execute(`
                SELECT
                    u.id,
                    u.name,
                    u.email,
                    u.role,
                    u.created_at,
                    u.account_status,
                    u.restriction_reason,
                    u.restriction_until
                FROM users u
                ORDER BY u.created_at DESC
            `);

            res.json({
                success: true,
                users: rows
            });

        } catch (error) {
            console.error(
                "Admin users error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Unable to load users."
            });
        }
    }
);


// Restrict or blacklist a user
app.patch(
    "/api/admin/users/:id/restrict",
    requireLogin,
    requireAdmin,
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const userId =
                Number(req.params.id);

            const {
                status,
                reason,
                duration
            } = req.body;

            if (!Number.isInteger(userId)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid user ID."
                });
            }

            if (
                status !== "restricted" &&
                status !== "blacklisted"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Status must be restricted or blacklisted."
                });
            }

            if (!reason || !String(reason).trim()) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Restriction reason is required."
                });
            }

            // Never allow the single admin account
            // to be restricted.
            const [users] =
                await db.execute(
                    `
                    SELECT id, role
                    FROM users
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [userId]
                );

            if (!users.length) {
                return res.status(404).json({
                    success: false,
                    message:
                        "User not found."
                });
            }

            if (users[0].role === "admin") {
                return res.status(403).json({
                    success: false,
                    message:
                        "The admin account cannot be restricted."
                });
            }

            let restrictionUntil = null;

            // Permanent blacklist
            if (status === "blacklisted") {
                restrictionUntil = null;
            }

            // Temporary restriction
            if (status === "restricted") {
                const days =
                    Number(duration);

                if (
                    !Number.isInteger(days) ||
                    days <= 0
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "A valid restriction duration is required."
                    });
                }

                restrictionUntil =
                    new Date(
                        Date.now() +
                        days *
                        24 *
                        60 *
                        60 *
                        1000
                    );
            }

            await db.execute(
                `
                UPDATE users
                SET
                    account_status = ?,
                    restriction_reason = ?,
                    restriction_until = ?
                WHERE id = ?
                `,
                [
                    status,
                    String(reason).trim(),
                    restrictionUntil,
                    userId
                ]
            );

            res.json({
                success: true,
                message:
                    status === "blacklisted"
                        ? "User blacklisted successfully."
                        : "User restricted successfully."
            });

        } catch (error) {
            console.error(
                "Admin restrict user error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Unable to restrict user."
            });
        }
    }
);


// Remove restriction
app.patch(
    "/api/admin/users/:id/unrestrict",
    requireLogin,
    requireAdmin,
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const userId =
                Number(req.params.id);

            if (!Number.isInteger(userId)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid user ID."
                });
            }

            const [users] =
                await db.execute(
                    `
                    SELECT id, role
                    FROM users
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [userId]
                );

            if (!users.length) {
                return res.status(404).json({
                    success: false,
                    message:
                        "User not found."
                });
            }

            if (users[0].role === "admin") {
                return res.status(403).json({
                    success: false,
                    message:
                        "The admin account cannot be modified."
                });
            }

            await db.execute(
                `
                UPDATE users
                SET
                    account_status = 'active',
                    restriction_reason = NULL,
                    restriction_until = NULL
                WHERE id = ?
                `,
                [userId]
            );

            res.json({
                success: true,
                message:
                    "User restriction removed successfully."
            });

        } catch (error) {
            console.error(
                "Admin unrestrict user error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Unable to remove restriction."
            });
        }
    }
);
/* =========================================================
   ADMIN - CURRENT ADMIN
========================================================= */

app.get(
    "/api/admin/me",
    requireLogin,
    requireAdmin,
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const adminUserId =
                Number(
                    req.user?.id ||
                    req.user?.userId
                );

            if (!adminUserId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Invalid admin session."
                });
            }

            const [rows] =
                await db.execute(
                    `
                    SELECT
                        u.id,
                        u.name,
                        u.email,
                        u.role,
                        a.id AS admin_id,
                        a.created_at
                    FROM users u
                    INNER JOIN admins a
                        ON a.user_id = u.id
                    WHERE u.id = ?
                      AND u.role = 'admin'
                    LIMIT 1
                    `,
                    [adminUserId]
                );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Admin account not found."
                });
            }

            res.json({
                success: true,
                admin: rows[0]
            });

        } catch (error) {
            console.error(
                "Get admin information error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load admin information."
            });
        }
    }
);


/* =========================================================
   ADMIN - CHANGE PASSWORD
========================================================= */

app.post(
    "/api/admin/change-password",
    requireLogin,
    requireAdmin,
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const currentPassword =
                String(
                    req.body.currentPassword || ""
                );

            const newPassword =
                String(
                    req.body.newPassword || ""
                );

            if (
                !currentPassword ||
                !newPassword
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Current password and new password are required."
                });
            }

            if (newPassword.length < 8) {
                return res.status(400).json({
                    success: false,
                    message:
                        "New password must contain at least 8 characters."
                });
            }

            const adminUserId =
                Number(
                    req.user?.id ||
                    req.user?.userId
                );

            if (!adminUserId) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Invalid admin session."
                });
            }

            const [rows] =
                await db.execute(
                    `
                    SELECT
                        u.id,
                        u.password
                    FROM users u
                    INNER JOIN admins a
                        ON a.user_id = u.id
                    WHERE
                        u.id = ?
                        AND u.role = 'admin'
                    LIMIT 1
                    `,
                    [adminUserId]
                );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Admin account not found."
                });
            }

            const passwordMatches =
                await bcrypt.compare(
                    currentPassword,
                    rows[0].password
                );

            if (!passwordMatches) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Current password is incorrect."
                });
            }

            const newPasswordHash =
                await bcrypt.hash(
                    newPassword,
                    12
                );

            await db.execute(
                `
                UPDATE users
                SET password = ?
                WHERE id = ?
                  AND role = 'admin'
                `,
                [
                    newPasswordHash,
                    adminUserId
                ]
            );

            res.json({
                success: true,
                message:
                    "Admin password changed successfully."
            });

        } catch (error) {
            console.error(
                "Admin password change error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to change admin password."
            });
        }
    }
);


/* =========================================================
   ADMIN - SYSTEM OVERVIEW
========================================================= */

app.get(
    "/api/admin/overview",
    requireLogin,
    requireAdmin,
    async (req, res) => {
        try {
            if (!requireDatabase(res)) {
                return;
            }

            const [
                [users]
            ] = await Promise.all([
                db.execute(
                    `
                    SELECT COUNT(*) AS total
                    FROM users
                    WHERE role != 'admin'
                    `
                )
            ]);

            const [books] =
                await db.execute(
                    `
                    SELECT
                        COUNT(*) AS total,
                        SUM(status = 'pending') AS pending,
                        SUM(status = 'verified') AS verified,
                        SUM(status = 'requested') AS requested,
                        SUM(status = 'transferred') AS transferred
                    FROM books
                    `
                );

            const [requests] =
                await db.execute(
                    `
                    SELECT
                        COUNT(*) AS total,
                        SUM(status = 'pending') AS pending,
                        SUM(status = 'accepted') AS accepted,
                        SUM(status = 'collected') AS collected,
                        SUM(status = 'reported') AS reported
                    FROM book_requests
                    `
                );

            const [reports] =
                await db.execute(
                    `
                    SELECT COUNT(*) AS total
                    FROM reports
                    `
                );

            const [collectionPoints] =
                await db.execute(
                    `
                    SELECT COUNT(*) AS total
                    FROM collection_points
                    `
                );

            res.json({
                success: true,
                overview: {
                    users:
                        users[0]?.total || 0,
                    books:
                        books[0] || {},
                    requests:
                        requests[0] || {},
                    reports:
                        reports[0]?.total || 0,
                    collectionPoints:
                        collectionPoints[0]?.total || 0
                }
            });

        } catch (error) {
            console.error(
                "Admin overview error:"
            );

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Unable to load admin overview."
            });
        }
    }
);
/* =========================================================
   ERROR HANDLER
========================================================= */

app.use(
    (err, req, res, next) => {
        console.error(
            "Unhandled server error:"
        );

        console.error(err);

        if (res.headersSent) {
            return next(err);
        }

        res.status(500).json({
            success: false,
            message:
                "Internal server error."
        });
    }
);


/* =========================================================
   START SERVER
========================================================= */

async function startServer() {
    await connectDatabase();

    app.listen(
        PORT,
        () => {
            console.log("");
            console.log(
                "=========================================="
            );
            console.log(
                "        MINEPTHE BACKEND SERVER"
            );
            console.log(
                "=========================================="
            );
            console.log(
                "Server running at http://localhost:" +
                PORT
            );
            console.log(
                "Smart Academic Book Sharing & Matching System"
            );
            console.log(
                "=========================================="
            );
            console.log("");
        }
    );
}


startServer();