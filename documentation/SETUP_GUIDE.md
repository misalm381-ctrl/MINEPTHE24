# MINEPTHE Quick Setup & Execution Guide

Follow these simple steps to run the complete MINEPTHE platform locally or deploy to cloud hosting.

---

## Prerequisites
- **Node.js**: v18.0.0 or higher
- **MySQL Server**: Local MySQL 8.0, XAMPP, or Cloud Database (Render, TiDB, Aiven)

---

## 1. Environment Configuration
Verify `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=minepthe
DB_SSL=false
JWT_SECRET=your_secret_key_here
```

---

## 2. Install Dependencies
Run from the project root:
```bash
npm.cmd run install:all
```

---

## 3. Database Setup & Migration
The database automatically checks and creates all 14 tables and seeds upon starting the server.
To manually seed initial sample data (Admin, Approved Desks, Sample Books):
```bash
npm.cmd run seed
```

---

## 4. Running the Application

### Start Backend API Server:
```bash
npm.cmd run dev:backend
```
Server runs at `http://localhost:3000`

### Start Frontend Web App:
```bash
npm.cmd run dev:frontend
```
Frontend runs at `http://localhost:5173`

---

## 5. Default Accounts for Testing
- **Admin**: `admin@minepthe.com`
- **Student**: `student@minepthe.com`
