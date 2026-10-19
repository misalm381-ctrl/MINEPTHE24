# MINEPTHE Database Documentation & Fixes

## 1. What was the Database Problem in mineptheII & How It Was Fixed

### The Issues Identified in mineptheII:
1. **Fragile Connection Lifecycle**:
   - `server.js` set `let db = null;` at startup. If the database was slow to connect or threw any initial timeout, `db` was permanently set to `null`.
   - Every single route executed `if (!requireDatabase(res)) return;` which rejected all incoming user requests with `503 Database Unavailable`.
2. **Environment Variable Path Disconnect**:
   - `require("dotenv").config()` was invoked without explicit path arguments. When node was executed from the workspace root or from parent folders, dotenv searched `process.cwd()`, failing to locate `backend/.env`. This resulted in `ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost' (using password: NO)`.
3. **Missing Auto-Migration & Bootstrap**:
   - Starting a fresh server on a new machine or Render cloud MySQL required manual SQL imports. If tables were absent, queries crashed the server.
4. **Collection Points Safety Filter Bug**:
   - `database/minepthe_clean.sql` seeded collection points with `safety_status = 'pending'`.
   - `server.js` queried `WHERE safety_status = 'approved'`.
   - Consequently, zero collection points were returned, breaking the donation and request dropdowns.

### The Fixes Implemented in MINEPTHE24:
1. **Resilient Connection Pool (`backend/config/db.js`)**:
   - Configured with `waitForConnections: true`, `connectionLimit: 15`, `enableKeepAlive: true`, and multi-directory `.env` resolution.
   - Transparent SSL support (`minVersion: "TLSv1.2", rejectUnauthorized: false`) for Render, TiDB, Aiven, and PlanetScale.
2. **Automated Schema Migration (`backend/database/migrator.js`)**:
   - Automatically executed on server start.
   - Checks if all 14 tables exist; if missing, automatically runs `database/schema.sql`.
   - Checks if approved collection points exist; if empty, automatically seeds verified campus desks from `database/seeds.sql`.
3. **Smart Collection Points Fallback**:
   - `GET /api/collection-points` queries approved or verified points (`safety_status = 'approved' OR is_verified = 1`), with fallback to all configured campus points so forms never render blank.

---

## 2. Entity Relationship Model & Table Dictionary

### The 14 Tables:
| # | Table Name | Purpose | Primary Key | Foreign Keys |
|---|------------|---------|-------------|--------------|
| 1 | `users` | Student & administrator authentication accounts | `id` | None |
| 2 | `admins` | Designates specific users with administrative privileges | `id` | `user_id` -> `users.id` |
| 3 | `student_profiles` | College, department, PRN, and ID card verification status | `id` | `user_id` -> `users.id` |
| 4 | `books` | Donated books, subject, department, cover image, status | `id` | `donor_id` -> `users.id`, `guest_donor_id` -> `guest_donors.id` |
| 5 | `book_requests` | Student requests for books with status workflow | `id` | `book_id` -> `books.id`, `requester_id` -> `users.id`, `collection_point_id` -> `collection_points.id` |
| 6 | `collection_points` | Verified campus collection points with geo-coordinates | `id` | None |
| 7 | `guest_donors` | Anonymous/guest donors verified via mobile OTP | `id` | None |
| 8 | `handovers` | Handover tracking with unique 6-digit collection OTP code | `id` | `request_id` -> `book_requests.id` |
| 9 | `messages` | Chat coordination between donor and receiver | `id` | `request_id` -> `book_requests.id` |
| 10 | `notifications` | In-app alerts for requests, handovers, and approvals | `id` | `user_id` -> `users.id` |
| 11 | `reports` | Student safety and violation reports | `id` | `reporter_id` -> `users.id` |
| 12 | `safety_records` | Trust metrics, warnings, and restrictions | `id` | `user_id` -> `users.id` |
| 13 | `donor_reputation` | Academic points, donation badges, and handover score | `id` | `user_id` -> `users.id` |
| 14 | `trusted_contacts` | Emergency and campus safety guardian contacts | `id` | `user_id` -> `users.id` |

---

## 3. Database Commands

### Test Database Connection:
```bash
npm --prefix backend run test:db
```

### Seed Default Data (Admin, Collection Points, Sample Books):
```bash
npm run seed
```
