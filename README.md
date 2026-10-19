# MINEPTHE
### Smart Academic Book Sharing & Matching System
*Give - Find - Grow*

MINEPTHE is a full-stack academic web platform designed to streamline book sharing, syllabus-based smart matching, verified campus handovers, and student safety.

---

## Key Features
- **Smart Book Matching**: AI & NLP syllabus analysis that scores and matches available textbooks to university curricula.
- **Academic DSA Engine**: 5 Data Structures & Algorithms (Dijkstra Shortest Path, Priority Queue, Graph BFS, Hash Table, MergeSort) implemented in C and JavaScript.
- **Safe Campus Handovers**: 6-digit OTP verification system with verified physical campus collection points.
- **Guest Book Donation**: Mobile OTP authentication allowing non-registered community donors to contribute.
- **Student ID Verification**: OCR/ID card upload with administrator verification.
- **Administrator Dashboard**: System-wide analytics, book approvals, user restriction management, and safety reports.

---

## Project Structure
```
MINEPTHE24/
|-- backend/
|   |-- config/          # MySQL connection pool (SSL, auto-reconnect)
|   |-- database/        # Automatic schema migration & table bootstrap
|   |-- dsa/             # Academic C algorithms & Node.js DSA modules
|   |-- middleware/      # Authentication & role verification
|   |-- routes/          # Clean, modular Express route handlers
|   |-- services/        # Request, OTP, Vision AI, and Matching services
|   `-- server.js        # Express server entrypoint
|-- database/
|   |-- schema.sql       # 14-table schema definition with constraints
|   `-- seeds.sql        # Initial admin, collection desks, sample books
|-- documentation/
|   |-- ARCHITECTURE.md  # System architecture & component design
|   |-- DATABASE.md      # Data dictionary, ER model & bug resolutions
|   |-- DSA_EXPLANATION.md # Time/space complexity & algorithm specs
|   |-- API_DOCUMENTATION.md # REST endpoints reference
|   `-- SETUP_GUIDE.md   # Local and cloud execution guide
`-- frontend/            # React 19 + Vite modern student web app
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm.cmd run install:all
```

### 2. Start Backend Server
```bash
npm.cmd run dev:backend
```
The server automatically checks the MySQL database, ensures all 14 tables exist, and starts at `http://localhost:3000`.

### 3. Start Frontend App
```bash
npm.cmd run dev:frontend
```
Access the web app at `http://localhost:5173`.

---

## Documentation Links
- [System Architecture](file:///c:/Users/Mahesh/MINEPTHE24/documentation/ARCHITECTURE.md)
- [Database & Schema Fixes](file:///c:/Users/Mahesh/MINEPTHE24/documentation/DATABASE.md)
- [DSA Algorithm Guide](file:///c:/Users/Mahesh/MINEPTHE24/documentation/DSA_EXPLANATION.md)
- [API Documentation](file:///c:/Users/Mahesh/MINEPTHE24/documentation/API_DOCUMENTATION.md)
- [Setup & Deployment Guide](file:///c:/Users/Mahesh/MINEPTHE24/documentation/SETUP_GUIDE.md)
