const path = require("path");
const fs = require("fs");

// Load .env from backend/.env or root .env
const envPaths = [
    path.resolve(__dirname, "..", ".env"),
    path.resolve(__dirname, "..", "..", ".env")
];

for (const p of envPaths) {
    if (fs.existsSync(p)) {
        require("dotenv").config({ path: p });
        break;
    }
}

const mysql = require("mysql2/promise");

const useSSL = String(process.env.DB_SSL || "").toLowerCase() === "true";

const poolConfig = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "",
    database: process.env.DB_NAME || "minepthe",
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    connectTimeout: 12000,
    multipleStatements: true,
    ...(useSSL
        ? {
              ssl: {
                  minVersion: "TLSv1.2",
                  rejectUnauthorized: false
              }
          }
        : {})
};

const pool = mysql.createPool(poolConfig);

/**
 * Execute a parameterized query with automatic pool acquisition
 */
async function query(sql, params = []) {
    return pool.query(sql, params);
}

/**
 * Execute a parameterized statement with automatic pool acquisition
 */
async function execute(sql, params = []) {
    return pool.execute(sql, params);
}

/**
 * Test connectivity to the database
 */
async function testConnection() {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query("SELECT 1");
        return {
            connected: true,
            host: poolConfig.host,
            port: poolConfig.port,
            database: poolConfig.database,
            ssl: useSSL
        };
    } catch (error) {
        return {
            connected: false,
            host: poolConfig.host,
            port: poolConfig.port,
            database: poolConfig.database,
            ssl: useSSL,
            error: error.message,
            code: error.code || "UNKNOWN"
        };
    } finally {
        if (connection) connection.release();
    }
}

/**
 * Deep healthcheck including table verification
 */
async function healthCheck() {
    try {
        const [tables] = await pool.query("SHOW TABLES");
        return {
            status: "healthy",
            connected: true,
            tableCount: tables.length,
            host: poolConfig.host,
            database: poolConfig.database
        };
    } catch (error) {
        return {
            status: "unhealthy",
            connected: false,
            error: error.message,
            code: error.code
        };
    }
}

module.exports = {
    pool,
    query,
    execute,
    testConnection,
    healthCheck,
    poolConfig
};
