// Backward-compatibility wrapper for backend/db.js
const { pool, testConnection, query, execute, healthCheck } = require("./config/db");

module.exports = {
    pool,
    testConnection: async () => {
        const res = await testConnection();
        return res.connected;
    },
    query,
    execute,
    healthCheck
};