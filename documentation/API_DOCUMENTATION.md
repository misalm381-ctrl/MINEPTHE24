# MINEPTHE REST API Documentation

Base URL: `http://localhost:3000`

---

## 1. Authentication
### `POST /api/register`
Creates a new student account.
- **Request Body**:
  ```json
  {
    "name": "Alex Student",
    "email": "alex@example.com",
    "password": "Password123"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "Registration successful.",
    "token": "<auth_token>",
    "user": { "id": 4, "name": "Alex Student", "email": "alex@example.com", "role": "student" }
  }
  ```

### `POST /api/login`
Authenticates a student and issues an access token.
- **Request Body**:
  ```json
  { "email": "alex@example.com", "password": "Password123" }
  ```

---

## 2. Administration
### `POST /api/admin/login`
- **Request Body**:
  ```json
  { "email": "admin@minepthe.com", "password": "your_admin_password" }
  ```

### `GET /api/admin/overview`
Requires `Bearer <token>` header with admin role.
- **Response**:
  ```json
  {
    "success": true,
    "overview": {
      "totalUsers": 12,
      "totalBooks": 25,
      "verifiedBooks": 20,
      "pendingBooks": 5,
      "totalRequests": 8,
      "totalReports": 0,
      "totalCollectionPoints": 3
    }
  }
  ```

### `PATCH /api/admin/books/:id/verify`
Updates book verification status (`verified`, `pending`, `transferred`).

---

## 3. Academic Books
### `GET /api/books`
Lists library books with optional search & filters.
- **Query Parameters**:
  - `department` (e.g., `Computer Engineering`)
  - `year` (e.g., `2`)
  - `search` (e.g., `Algorithms`)
  - `status` (e.g., `verified`)

### `GET /api/books/:id`
Retrieves book details and donor information.

### `POST /api/books/donate`
Submits a book donation for verification.
- **Request Body**:
  ```json
  {
    "donorId": 1,
    "title": "Data Structures in C",
    "author": "Mark Weiss",
    "subject": "Data Structures",
    "department": "Computer Engineering",
    "year": "2",
    "description": "Hardcover copy in good condition",
    "coverImage": "data:image/png;base64,..."
  }
  ```

### `POST /api/books/match`
Performs smart syllabus and subject keyword matching.
- **Request Body**:
  ```json
  { "subjects": ["Data Structures", "Computer Networks"] }
  ```

---

## 4. Book Requests & Handovers
### `POST /api/requests`
Submits a book request to the donor.
- **Request Body**:
  ```json
  {
    "bookId": 1,
    "requesterId": 2,
    "collectionPointId": 1,
    "donorCollectionMessage": "Can collect on Friday"
  }
  ```

### `POST /api/handovers`
Generates a handover agreement and a unique 6-digit collection OTP code.
- **Request Body**:
  ```json
  { "requestId": 1 }
  ```

### `POST /api/handovers/verify-code`
Verifies collection OTP code at the campus collection desk to complete transfer.
- **Request Body**:
  ```json
  { "requestId": 1, "collectionCode": "410676" }
  ```

---

## 5. Guest Donation (No Account Required)
### `POST /api/guest/send-otp`
Sends a 6-digit demo verification code to the guest's mobile number.
- **Request Body**: `{ "phone": "9876543210" }`

### `POST /api/guest/verify-otp`
Verifies phone number and returns a temporary guest token.

### `POST /api/guest/donate-book`
Donates book under guest identity using the verification token.

---

## 6. DSA Algorithmic Endpoints
- `POST /api/dsa/dijkstra` - Computes shortest path to nearest campus collection desk.
- `POST /api/dsa/priority-queue` - Simulates urgent academic request allocation.
- `GET /api/dsa/graph` - Returns department-subject-book network graph.
- `POST /api/dsa/hash-table` - Performs $O(1)$ book lookup.
- `POST /api/dsa/search-sort` - Demonstrates merge sort ranking.
