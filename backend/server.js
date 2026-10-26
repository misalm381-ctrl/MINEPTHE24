const path = require("path");
const fs = require("fs");

// Load environment variables
const envPaths = [
    path.resolve(__dirname, ".env"),
    path.resolve(__dirname, "..", ".env")
];
for (const p of envPaths) {
    if (fs.existsSync(p)) {
        require("dotenv").config({ path: p });
        break;
    }
}

const express = require("express");
const cors = require("cors");
const { testConnection, healthCheck } = require("./config/db");
const { autoMigrate } = require("./database/migrator");

// Route modules
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const booksRoutes = require("./routes/books.routes");
const requestsRoutes = require("./routes/requests.routes");
const handoversRoutes = require("./routes/handovers.routes");
const guestRoutes = require("./routes/guest.routes");
const messagesRoutes = require("./routes/messages.routes");
const notificationsRoutes = require("./routes/notifications.routes");
const safetyRoutes = require("./routes/safety.routes");
const aiRoutes = require("./routes/ai.routes");
const dsaRoutes = require("./routes/dsa.routes");

const app = express();
const PORT = Number(process.env.PORT || 3000);

/* =========================================================
   MIDDLEWARE
========================================================= */
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
}));

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Static uploads directory
const uploadsDir = path.resolve(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Frontend static distribution (Vite React app)
const frontendDist = path.resolve(__dirname, "..", "frontend", "dist");
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
}

/* =========================================================
   SYSTEM HEALTH & ROOT
========================================================= */
app.get("/api", (req, res) => {
    res.json({
        success: true,
        project: "MINEPTHE",
        description: "Smart Academic Book Sharing & Matching System",
        motto: "Give - Find - Grow",
        status: "Backend online and operational",
        version: "2.4.0",
        timestamp: new Date().toISOString()
    });
});

if (!fs.existsSync(frontendDist)) {
    app.get("/", (req, res) => {
        res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=/api" />
  <title>MINEPTHE - Loading...</title>
  <style>
    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f2419; color: #a3d9b1; }
    .box { text-align: center; }
    h1 { font-size: 2rem; margin-bottom: 8px; }
    p { opacity: 0.7; font-size: 1rem; }
    .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #4ade80; margin: 0 4px; animation: pulse 1.2s infinite; }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
  </style>
</head>
<body>
  <div class="box">
    <h1>MINEPTHE</h1>
    <p>Backend is online. Frontend is building...</p>
    <p><span class="dot"></span><span class="dot"></span><span class="dot"></span></p>
    <p style="margin-top:16px;font-size:0.85rem">If this persists, the build may have failed. Check Render deploy logs.</p>
  </div>
</body>
</html>`);
    });
}

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "MINEPTHE backend API is fully operational."
    });
});

app.get("/api/health", async (req, res) => {
    const dbStatus = await healthCheck();
    res.json({
        success: dbStatus.connected,
        project: "MINEPTHE",
        backend: "online",
        uptime: process.uptime(),
        database: dbStatus
    });
});

/* =========================================================
   API ROUTE MOUNTING
========================================================= */
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api", handoversRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api", safetyRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dsa", dsaRoutes);

// Compatibility alias for user donations: /api/users/:userId/donations
app.get("/api/users/:userId/donations", async (req, res) => {
    req.url = `/user/${req.params.userId}`;
    return booksRoutes(req, res);
});

// Single Page Application routing for frontend
if (fs.existsSync(frontendDist)) {
    app.use((req, res, next) => {
        if (req.method !== "GET") return next();
        if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
            return next();
        }
        res.sendFile(path.join(frontendDist, "index.html"));
    });
}

/* =========================================================
   404 NOT FOUND & GLOBAL ERROR HANDLER
========================================================= */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint not found: ${req.method} ${req.originalUrl}`
    });
});

app.use((err, req, res, next) => {
    console.error("Unhandled API Error:", err.stack || err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error occurred."
    });
});

/* =========================================================
   SERVER BOOTSTRAP
========================================================= */
async function startServer() {
    console.log("==========================================");
    console.log("         STARTING MINEPTHE BACKEND        ");
    console.log("==========================================");

    // 1. Verify Database Connectivity
    const conn = await testConnection();
    if (conn.connected) {
        console.log(`MySQL Connected successfully -> ${conn.host}:${conn.port}/${conn.database}`);
        // 2. Run Auto-Migrator
        await autoMigrate();
    } else {
        console.error("CRITICAL: Database connection failed during startup!");
        console.error("Details:", conn.error);
        console.log("Server will start in resilient mode. Database reconnection will retry on incoming queries.");
    }

    // 3. Start Listening
    app.listen(PORT, () => {
        console.log("==========================================");
        console.log(` MINEPTHE Server running at http://localhost:${PORT}`);
        console.log(" Mode: Modular Production Architecture");
        console.log(" DSA Engine: Ready");
        console.log("==========================================");
    });
}

// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully...");
    process.exit(0);
});

startServer();