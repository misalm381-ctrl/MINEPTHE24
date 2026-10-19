-- ========================================================
-- MINEPTHE - Seed Data
-- Default Admin, Verified Collection Points, and Sample Books
-- ========================================================

USE `minepthe`;

-- Default Admin User (Password: admin123)
-- bcrypt hash for 'admin123' is '$2b$10$wY9/97f0rU7v6sJmQ/6uXeF6O42JtA5uQo/mC83J0g7QZJ7s1l0rO'
-- We also insert standard test student
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`)
VALUES
  (1, 'Student Demo User', 'student@minepthe.com', '$2b$10$5M8pM7d.hN7P41a9Y7j5.e7lQ8GfN/08U7.6q9c7vYfO8tP1s9q3e', 'student'),
  (2, 'Mahesh Misal', 'mahesh@minepthe.com', '$2b$10$5M8pM7d.hN7P41a9Y7j5.e7lQ8GfN/08U7.6q9c7vYfO8tP1s9q3e', 'student'),
  (3, 'MINEPTHE Administrator', 'admin@minepthe.com', '$2b$12$hK5NADsfE2tVD8Q4sxxU2u.l54u98Jb9NlHbXY0K3Ft.D.eO8rVoe', 'admin')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `role` = VALUES(`role`);

-- Admin Link
INSERT INTO `admins` (`id`, `user_id`)
VALUES (1, 3)
ON DUPLICATE KEY UPDATE `user_id` = VALUES(`user_id`);

-- Donor Reputation for students
INSERT INTO `donor_reputation` (`user_id`, `points`, `successful_donations`, `verified_books`, `successful_handovers`)
VALUES
  (1, 25, 2, 3, 2),
  (2, 40, 4, 5, 4)
ON DUPLICATE KEY UPDATE `points` = VALUES(`points`);

-- Verified Safe Academic Collection Points
INSERT INTO `collection_points` (`id`, `name`, `address`, `latitude`, `longitude`, `contact_person`, `instructions`, `is_verified`, `safety_status`)
VALUES
  (1, 'Central Campus Library Desk', 'Academic Block A, Ground Floor, Central Library Entrance', 18.5204303, 73.8567437, 'Mr. Sharma (Librarian)', 'Hand over books at the front desk counter between 9:00 AM and 5:00 PM.', 1, 'approved'),
  (2, 'Computer Department Safe Kiosk', 'CS Building, 2nd Floor, Seminar Hall Foyer', 18.5221000, 73.8582000, 'Prof. Kulkarni', 'Drop books with volunteer desk coordinator with confirmation OTP.', 1, 'approved'),
  (3, 'Student Activity Centre (SAC)', 'SAC Building, Near Main Sports Ground, Room 104', 18.5195000, 73.8551000, 'Student Welfare Officer', 'Open Monday to Saturday 10:00 AM - 6:00 PM for verified exchanges.', 1, 'approved')
ON DUPLICATE KEY UPDATE
  `safety_status` = 'approved',
  `is_verified` = 1;

-- Academic Books
INSERT INTO `books` (`id`, `donor_id`, `title`, `author`, `subject`, `department`, `year`, `description`, `status`)
VALUES
  (1, 1, 'Data Structures and Algorithms in C', 'Mark Allen Weiss', 'Computer Science', 'Computer Engineering', '2', 'Comprehensive guide covering Stacks, Queues, Binary Trees, and Dijkstra Graphs.', 'verified'),
  (2, 2, 'Operating System Concepts (Silberschatz)', 'Abraham Silberschatz', 'Operating Systems', 'Information Technology', '3', 'Clean hardcover edition, covering Memory Management, Scheduling, and Multi-threading.', 'verified'),
  (3, 1, 'Database System Concepts (Korth)', 'Silberschatz, Korth, Sudarshan', 'DBMS', 'Computer Engineering', '2', 'Standard university textbook with SQL queries, relational algebra, and ER diagrams.', 'verified'),
  (4, 2, 'Higher Engineering Mathematics', 'B.S. Grewal', 'Engineering Mathematics', 'First Year Common', '1', 'Essential for Semester 1 and 2 Calculus, Linear Algebra, and Differential Equations.', 'verified'),
  (5, 1, 'Computer Networks', 'Andrew S. Tanenbaum', 'Networking', 'Computer Engineering', '3', 'Top-down approach textbook with OSI model and TCP/IP protocol suite.', 'verified')
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `status` = 'verified';
