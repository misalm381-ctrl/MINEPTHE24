-- ========================================================
-- MINEPTHE - Smart Academic Book Sharing & Matching System
-- Complete Database Schema (14 Tables)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `minepthe` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `minepthe`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_admins_user_id` (`user_id`),
  CONSTRAINT `fk_admins_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Student Profiles
CREATE TABLE IF NOT EXISTS `student_profiles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `college` VARCHAR(200) DEFAULT NULL,
  `course` VARCHAR(100) DEFAULT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `year` VARCHAR(20) DEFAULT NULL,
  `division` VARCHAR(20) DEFAULT NULL,
  `roll_no` VARCHAR(50) DEFAULT NULL,
  `prn` VARCHAR(100) DEFAULT NULL,
  `syllabus` TEXT DEFAULT NULL,
  `institution_name` VARCHAR(200) DEFAULT NULL,
  `id_card_image` LONGTEXT DEFAULT NULL,
  `id_card_verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_student_profiles_user` (`user_id`),
  CONSTRAINT `fk_student_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Guest Donors
CREATE TABLE IF NOT EXISTS `guest_donors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `phone` VARCHAR(30) DEFAULT NULL,
  `phone_verified` TINYINT(1) DEFAULT 0,
  `email` VARCHAR(150) DEFAULT NULL,
  `email_verified` TINYINT(1) DEFAULT 0,
  `verification_code` VARCHAR(10) DEFAULT NULL,
  `verification_expires_at` TIMESTAMP NULL DEFAULT NULL,
  `verification_attempts` INT DEFAULT 0,
  `verified_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_guest_donors_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Collection Points
CREATE TABLE IF NOT EXISTS `collection_points` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `address` VARCHAR(500) NOT NULL,
  `latitude` DECIMAL(10, 7) DEFAULT NULL,
  `longitude` DECIMAL(10, 7) DEFAULT NULL,
  `contact_person` VARCHAR(150) DEFAULT NULL,
  `instructions` TEXT DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT 1,
  `safety_status` ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Books
CREATE TABLE IF NOT EXISTS `books` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `donor_id` INT DEFAULT NULL,
  `guest_donor_id` INT DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `author` VARCHAR(150) DEFAULT NULL,
  `subject` VARCHAR(150) DEFAULT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `year` VARCHAR(20) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `cover_image` LONGTEXT DEFAULT NULL,
  `status` ENUM('pending', 'verified', 'requested', 'transferred') DEFAULT 'verified',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_books_donor` (`donor_id`),
  KEY `idx_books_guest` (`guest_donor_id`),
  KEY `idx_books_status` (`status`),
  CONSTRAINT `fk_books_donor` FOREIGN KEY (`donor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_books_guest` FOREIGN KEY (`guest_donor_id`) REFERENCES `guest_donors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Book Requests
CREATE TABLE IF NOT EXISTS `book_requests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `book_id` INT NOT NULL,
  `requester_id` INT NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected', 'collected', 'reported') DEFAULT 'pending',
  `collection_location` VARCHAR(255) DEFAULT NULL,
  `collection_point_id` INT DEFAULT NULL,
  `collection_code` VARCHAR(20) DEFAULT NULL,
  `donor_collection_message` TEXT DEFAULT NULL,
  `pickup_safety_status` ENUM('pending', 'approved', 'needs_review', 'rejected') DEFAULT 'pending',
  `safety_issue_status` ENUM('none', 'reported', 'under_review', 'resolved') DEFAULT 'none',
  `requested_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_requests_book` (`book_id`),
  KEY `idx_requests_user` (`requester_id`),
  CONSTRAINT `fk_requests_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_requests_user` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_requests_point` FOREIGN KEY (`collection_point_id`) REFERENCES `collection_points` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Handovers
CREATE TABLE IF NOT EXISTS `handovers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `request_id` INT NOT NULL,
  `status` ENUM('accepted', 'meeting_scheduled', 'book_ready', 'collected', 'reported', 'cancelled', 'completed') DEFAULT 'accepted',
  `scheduled_date` DATE DEFAULT NULL,
  `scheduled_time` TIME DEFAULT NULL,
  `collection_code_verified` TINYINT(1) DEFAULT 0,
  `receiver_confirmed` TINYINT(1) DEFAULT 0,
  `donor_confirmed` TINYINT(1) DEFAULT 0,
  `verified_at` TIMESTAMP NULL DEFAULT NULL,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_handovers_request` (`request_id`),
  CONSTRAINT `fk_handovers_request` FOREIGN KEY (`request_id`) REFERENCES `book_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `request_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `sender_type` ENUM('receiver', 'donor') NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_messages_request` (`request_id`),
  CONSTRAINT `fk_messages_request` FOREIGN KEY (`request_id`) REFERENCES `book_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user` (`user_id`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Reports
CREATE TABLE IF NOT EXISTS `reports` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `request_id` INT DEFAULT NULL,
  `reporter_id` INT NOT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `evidence_image` LONGTEXT DEFAULT NULL,
  `status` ENUM('pending', 'investigating', 'confirmed', 'rejected') DEFAULT 'pending',
  `admin_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reports_reporter` (`reporter_id`),
  CONSTRAINT `fk_reports_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Safety Records
CREATE TABLE IF NOT EXISTS `safety_records` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT DEFAULT NULL,
  `guest_donor_id` INT DEFAULT NULL,
  `warnings` INT DEFAULT 0,
  `confirmed_violations` INT DEFAULT 0,
  `safety_status` ENUM('normal', 'under_review', 'restricted', 'blacklisted') DEFAULT 'normal',
  `last_reviewed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_safety_user` (`user_id`),
  KEY `idx_safety_guest` (`guest_donor_id`),
  CONSTRAINT `fk_safety_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Donor Reputation
CREATE TABLE IF NOT EXISTS `donor_reputation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `points` INT DEFAULT 10,
  `successful_donations` INT DEFAULT 0,
  `verified_books` INT DEFAULT 0,
  `successful_handovers` INT DEFAULT 0,
  `warnings` INT DEFAULT 0,
  `restricted` TINYINT(1) DEFAULT 0,
  `blacklisted` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_reputation_user` (`user_id`),
  CONSTRAINT `fk_reputation_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Trusted Contacts
CREATE TABLE IF NOT EXISTS `trusted_contacts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `relationship` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contacts_user` (`user_id`),
  CONSTRAINT `fk_contacts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
