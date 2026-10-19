const fs = require("fs");
const path = require("path");
const { pool } = require("../config/db");

async function autoMigrate() {
    console.log("Running MINEPTHE database auto-check and migration...");
    try {
        // 1. Check if database is accessible
        const [tables] = await pool.query("SHOW TABLES");
        const tableNames = tables.map((t) => Object.values(t)[0]);

        const requiredTables = [
            "users",
            "admins",
            "student_profiles",
            "books",
            "book_requests",
            "collection_points",
            "guest_donors",
            "handovers",
            "messages",
            "notifications",
            "reports",
            "safety_records",
            "donor_reputation",
            "trusted_contacts"
        ];

        const missingTables = requiredTables.filter(
            (tbl) => !tableNames.includes(tbl)
        );

        if (missingTables.length > 0) {
            console.log(
                `Missing tables detected: ${missingTables.join(", ")}. Applying schema...`
            );

            const schemaPath = path.resolve(
                __dirname,
                "..",
                "..",
                "database",
                "schema.sql"
            );

            if (fs.existsSync(schemaPath)) {
                let schemaSql = fs.readFileSync(schemaPath, "utf8");
                schemaSql = schemaSql
                    .replace(/^CREATE DATABASE [^\n]*;/im, "")
                    .replace(/^USE [^\n]*;/im, "");
                await pool.query(schemaSql);
                console.log("Database schema successfully applied.");
            } else {
                console.warn(`Schema file not found at ${schemaPath}`);
            }
        } else {
            console.log(`All ${requiredTables.length} required database tables are present.`);
        }

        // 2. Ensure collection points have active points
        try {
            const [points] = await pool.query(
                "SELECT COUNT(*) as count FROM collection_points WHERE safety_status = 'approved'"
            );
            if (points[0].count === 0) {
                console.log("No approved collection points found. Applying seed data...");
                const seedsPath = path.resolve(
                    __dirname,
                    "..",
                    "..",
                    "database",
                    "seeds.sql"
                );
                if (fs.existsSync(seedsPath)) {
                    let seedsSql = fs.readFileSync(seedsPath, "utf8");
                    seedsSql = seedsSql.replace(/^USE [^\n]*;/im, "");
                    await pool.query(seedsSql);
                    console.log("Seed data successfully applied.");
                } else {
                    // Update any existing points to approved
                    await pool.query(
                        "UPDATE collection_points SET safety_status = 'approved', is_verified = 1"
                    );
                }
            }
        } catch (seedErr) {
            console.warn("Notice during collection points check:", seedErr.message);
        }

        return true;
    } catch (error) {
        console.error("Database migration check error:", error.message);
        return false;
    }
}

module.exports = { autoMigrate };
