require("dotenv").config();

const bcrypt = require("bcryptjs");
const { pool } = require("./db");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function createAdmin() {
    let db;

    try {
        console.log("");
        console.log("======================================");
        console.log("       MINEPTHE ADMIN SETUP");
        console.log("======================================");
        console.log("");

        const name =
            (await ask("Admin name: ")).trim();

        const email =
            (await ask("Admin email: ")).trim().toLowerCase();

        const password =
            await ask("Admin password: ");

        const confirmPassword =
            await ask("Confirm password: ");

        if (!name) {
            throw new Error(
                "Admin name is required."
            );
        }

        if (!email) {
            throw new Error(
                "Admin email is required."
            );
        }

        if (!password) {
            throw new Error(
                "Admin password is required."
            );
        }

        if (password.length < 8) {
            throw new Error(
                "Admin password must contain at least 8 characters."
            );
        }

        if (password !== confirmPassword) {
            throw new Error(
                "Passwords do not match."
            );
        }

        db = pool;

        /*
         * Make sure there is only ONE admin.
         */

        const [adminRows] =
            await db.execute(
                `
                SELECT
                    a.id,
                    a.user_id,
                    u.email
                FROM admins a
                INNER JOIN users u
                    ON a.user_id = u.id
                LIMIT 1
                `
            );

        if (adminRows.length > 0) {
            console.log("");
            console.log(
                "An admin account already exists."
            );
            console.log(
                "Admin email:",
                adminRows[0].email
            );
            console.log("");
            console.log(
                "Use the admin change-password feature"
            );
            console.log(
                "instead of creating another admin."
            );

            return;
        }

        /*
         * Check whether this email already
         * belongs to a normal user.
         */

        const [existingUsers] =
            await db.execute(
                `
                SELECT
                    id,
                    role
                FROM users
                WHERE email = ?
                LIMIT 1
                `,
                [email]
            );

        if (existingUsers.length > 0) {
            throw new Error(
                "This email already belongs to a user. Use another admin email."
            );
        }

        /*
         * Hash password.
         */

        const passwordHash =
            await bcrypt.hash(
                password,
                12
            );

        /*
         * Create admin user.
         */

        const [userResult] =
            await db.execute(
                `
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    role
                )
                VALUES
                (?, ?, ?, 'admin')
                `,
                [
                    name,
                    email,
                    passwordHash
                ]
            );

        const userId =
            userResult.insertId;

        /*
         * Register this user in admins.
         */

        await db.execute(
            `
            INSERT INTO admins
            (
                user_id
            )
            VALUES (?)
            `,
            [userId]
        );

        console.log("");
        console.log(
            "======================================"
        );
        console.log(
            "      ADMIN CREATED SUCCESSFULLY"
        );
        console.log(
            "======================================"
        );
        console.log(
            "Admin ID:",
            userId
        );
        console.log(
            "Admin email:",
            email
        );
        console.log(
            "Role: admin"
        );
        console.log("");
        console.log(
            "Password is stored as a bcrypt hash."
        );
        console.log(
            "The plaintext password is NOT stored."
        );
        console.log(
            "======================================"
        );
        console.log("");
    } catch (error) {
        console.error("");
        console.error(
            "Admin setup failed:"
        );
        console.error(
            error.message
        );
        console.error("");
    } finally {
        if (db) {
            await db.end();
        }

        rl.close();
    }
}

createAdmin();