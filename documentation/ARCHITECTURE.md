# MINEPTHE System Architecture

## Overview
**MINEPTHE** (*Smart Academic Book Sharing & Matching System*) is an academic exchange platform designed to streamline book donation, algorithmic syllabus matching, verified campus handovers, and student safety.

---

## Architectural Principles
1. **Separation of Concerns**: High-level routes, business services, database access layer, and DSA algorithm modules are strictly decoupled.
2. **Resilient Data Access**: Resilient MySQL connection pooling with multi-path environment variable discovery, TLS/SSL compatibility for both local and cloud databases, and automatic schema verification on startup.
3. **Dual Execution Engine (C & JavaScript DSA)**: Data Structure & Algorithm implementations exist as foundational C programs for academic evaluation and optimized Node.js engines for runtime execution.
4. **Security & Role-Based Access Control**: Strict authentication middleware verifying student and administrator permissions with session and token expiry.

---

## System Architecture Diagram

```
+-----------------------------------------------------------------+
|                       Vite + React Frontend                     |
|  (Home, Books, Donate, Requests, Smart Matching, Admin, Chat)   |
+--------------------------------+--------------------------------+
                                 | REST API (HTTP/JSON)
                                 v
+-----------------------------------------------------------------+
|                     Express.js Backend API                      |
+--------------------------------+--------------------------------+
| Middleware: Auth (Tokens/JWT)  | Error Handler | File Uploads   |
+--------------------------------+--------------------------------+
| Routes Layer:                                                   |
|  - /api (Auth: Register, Login)|  - /api/guest (OTP & Donate)   |
|  - /api/books (CRUD & Match)   |  - /api/handovers & Points     |
|  - /api/requests (Workflow)    |  - /api/messages & Alerts      |
|  - /api/admin (Dashboard/Me)   |  - /api/safety & Verification  |
|  - /api/ai (Vision & NLP)      |  - /api/dsa (Algorithmic Hub)  |
+--------------------------------+--------------------------------+
| Services & DSA Layer:                                           |
|  - Request Workflow Service    |  - Dijkstra Shortest Path      |
|  - Vision AI Analyzer          |  - Binary Heap Priority Queue  |
|  - Syllabus NLP Analyzer       |  - Adjacency List Graph        |
|  - Keyword Score Matcher       |  - Separate Chaining Hash Table|
|  - OTP & Phone Verification    |  - MergeSort & Binary Search   |
+--------------------------------+--------------------------------+
                                 | Connection Pool (KeepAlive, SSL)
                                 v
+-----------------------------------------------------------------+
|                   MySQL Database (14 Tables)                    |
| Users, Admins, StudentProfiles, Books, Requests, Handovers,     |
| CollectionPoints, Messages, Notifications, Safety, Reputation   |
+-----------------------------------------------------------------+
```

---

## Folder Organization
```
MINEPTHE24/
|-- backend/
|   |-- config/          # Database connection pool & environment loader
|   |-- database/        # Auto-migration & schema synchronizer
|   |-- dsa/             # C source files + Node.js DSA implementations
|   |-- middleware/      # Authentication, Admin checks, Error handling
|   |-- routes/          # Clean, modular Express routers
|   |-- services/        # Business logic (AI, Matching, Requests, OTP)
|   |-- uploads/         # Book cover and ID verification uploads
|   |-- server.js        # Server entrypoint and router bootstrap
|-- database/
|   |-- schema.sql       # 14-table schema definition with constraints
|   |-- seeds.sql        # Initial admin, verified points, sample books
|-- documentation/       # Architecture, API, DSA, and Setup guides
`-- frontend/            # React 19 + Vite frontend application
```
