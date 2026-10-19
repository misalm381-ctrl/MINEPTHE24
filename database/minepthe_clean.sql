-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: minepthe
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `minepthe`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `minepthe` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `minepthe`;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,3,'2026-10-02 19:14:08');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_requests`
--

DROP TABLE IF EXISTS `book_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `requester_id` int NOT NULL,
  `status` enum('pending','accepted','rejected','collected','reported') DEFAULT 'pending',
  `collection_location` varchar(255) DEFAULT NULL,
  `collection_code` varchar(20) DEFAULT NULL,
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `collection_point_id` int DEFAULT NULL,
  `donor_collection_message` text,
  `pickup_safety_status` enum('pending','approved','needs_review','rejected') DEFAULT 'pending',
  `safety_issue_status` enum('none','reported','under_review','resolved') DEFAULT 'none',
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`),
  KEY `requester_id` (`requester_id`),
  KEY `fk_request_collection_point` (`collection_point_id`),
  CONSTRAINT `book_requests_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `book_requests_ibfk_2` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_request_collection_point` FOREIGN KEY (`collection_point_id`) REFERENCES `collection_points` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_requests`
--

LOCK TABLES `book_requests` WRITE;
/*!40000 ALTER TABLE `book_requests` DISABLE KEYS */;
INSERT INTO `book_requests` VALUES (1,1,1,'reported','MINEPTHE Test Collection Point','410676','2026-09-26 18:56:17',NULL,'Please keep the book ready for collection.','pending','reported');
/*!40000 ALTER TABLE `book_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donor_id` int DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `author` varchar(150) DEFAULT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `year` varchar(20) DEFAULT NULL,
  `description` text,
  `cover_image` longtext,
  `status` enum('pending','verified','requested','transferred') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `guest_donor_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `donor_id` (`donor_id`),
  KEY `fk_books_guest_donor` (`guest_donor_id`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`donor_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_books_guest_donor` FOREIGN KEY (`guest_donor_id`) REFERENCES `guest_donors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,1,'Data Structures and Algorithms','Test Author','Computer Science','Computer Engineering','2','MINEPTHE backend test book',NULL,'verified','2026-09-26 18:55:44',NULL),(2,NULL,'hgtftu','htftu','utye7d',NULL,NULL,'Language: English | ISBN: ytru6rf | Condition: Acceptable | Collection: punejhygfj | hgfhgf',NULL,'pending','2026-09-28 16:37:08',6);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collection_points`
--

DROP TABLE IF EXISTS `collection_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collection_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `address` varchar(500) NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `contact_person` varchar(150) DEFAULT NULL,
  `instructions` text,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `safety_status` enum('pending','approved','rejected') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collection_points`
--

LOCK TABLES `collection_points` WRITE;
/*!40000 ALTER TABLE `collection_points` DISABLE KEYS */;
INSERT INTO `collection_points` VALUES (1,'MINEPTHE Safe Collection Point','Near Test College, Pune',18.5204000,73.8567000,'MINEPTHE Coordinator','Collect books during the approved collection time.',0,'2026-09-26 18:58:21','pending');
/*!40000 ALTER TABLE `collection_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donor_reputation`
--

DROP TABLE IF EXISTS `donor_reputation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donor_reputation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `points` int DEFAULT '0',
  `successful_donations` int DEFAULT '0',
  `verified_books` int DEFAULT '0',
  `successful_handovers` int DEFAULT '0',
  `warnings` int DEFAULT '0',
  `restricted` tinyint(1) DEFAULT '0',
  `blacklisted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `donor_reputation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donor_reputation`
--

LOCK TABLES `donor_reputation` WRITE;
/*!40000 ALTER TABLE `donor_reputation` DISABLE KEYS */;
INSERT INTO `donor_reputation` VALUES (1,1,10,0,1,0,0,0,0),(4,2,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `donor_reputation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guest_donors`
--

DROP TABLE IF EXISTS `guest_donors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest_donors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `verification_code` varchar(10) DEFAULT NULL,
  `verification_expires_at` timestamp NULL DEFAULT NULL,
  `verification_attempts` int DEFAULT '0',
  `verified_at` timestamp NULL DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `phone_verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest_donors`
--

LOCK TABLES `guest_donors` WRITE;
/*!40000 ALTER TABLE `guest_donors` DISABLE KEYS */;
INSERT INTO `guest_donors` VALUES (1,NULL,0,'2026-09-11 04:41:44',NULL,NULL,0,NULL,'9673190453',1),(2,NULL,0,'2026-09-11 05:33:48',NULL,NULL,0,NULL,'9322725614',1),(3,NULL,0,'2026-09-15 15:50:14',NULL,NULL,0,NULL,'1010101010',1),(4,'guest_1212121212_1790521104622@minepthe.local',0,'2026-09-27 14:58:24',NULL,NULL,0,'2026-09-27 15:05:22','1212121212',1),(5,'guest_1790524003918_60788@minepthe.local',0,'2026-09-27 15:46:43',NULL,NULL,0,'2026-09-27 15:46:43',NULL,1),(6,'guest_1790613425160_91457@minepthe.local',0,'2026-09-28 16:37:05',NULL,NULL,0,'2026-09-28 16:37:05',NULL,1),(7,'guest_1790615058385_60507@minepthe.local',0,'2026-09-28 17:04:18',NULL,NULL,0,'2026-09-28 17:04:18',NULL,1);
/*!40000 ALTER TABLE `guest_donors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `handovers`
--

DROP TABLE IF EXISTS `handovers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `handovers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `status` enum('accepted','meeting_scheduled','book_ready','collected','reported','cancelled','completed') DEFAULT 'accepted',
  `scheduled_date` date DEFAULT NULL,
  `scheduled_time` time DEFAULT NULL,
  `receiver_confirmed` tinyint(1) DEFAULT '0',
  `donor_confirmed` tinyint(1) DEFAULT '0',
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `collection_code_verified` tinyint(1) DEFAULT '0',
  `verified_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_id` (`request_id`),
  CONSTRAINT `handovers_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `book_requests` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `handovers`
--

LOCK TABLES `handovers` WRITE;
/*!40000 ALTER TABLE `handovers` DISABLE KEYS */;
INSERT INTO `handovers` VALUES (1,1,'collected',NULL,NULL,1,0,'2026-09-26 18:59:23','2026-09-26 18:58:53',1,'2026-09-26 18:59:23');
/*!40000 ALTER TABLE `handovers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `sender_id` int DEFAULT NULL,
  `sender_type` enum('receiver','donor') NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `request_id` (`request_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `book_requests` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,1,1,'receiver','The book is ready for collection.','2026-09-26 19:03:09'),(2,1,1,'receiver','The book is ready for collection.','2026-09-26 19:04:43');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'A student requested your book: Data Structures and Algorithms',0,'2026-09-26 18:56:17');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `reporter_id` int NOT NULL,
  `reason` varchar(255) NOT NULL,
  `description` text,
  `status` enum('pending','investigating','confirmed','rejected') DEFAULT 'pending',
  `admin_notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(100) DEFAULT NULL,
  `evidence_image` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `request_id` (`request_id`),
  KEY `reporter_id` (`reporter_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `book_requests` (`id`),
  CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,1,1,'Backend testing report',NULL,'pending',NULL,'2026-09-26 19:06:04',NULL,NULL),(2,1,1,'Backend testing report',NULL,'pending',NULL,'2026-09-26 19:06:23',NULL,NULL);
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `safety_records`
--

DROP TABLE IF EXISTS `safety_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `safety_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `guest_donor_id` int DEFAULT NULL,
  `warnings` int DEFAULT '0',
  `confirmed_violations` int DEFAULT '0',
  `safety_status` enum('normal','under_review','restricted','blacklisted') DEFAULT 'normal',
  `last_reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `guest_donor_id` (`guest_donor_id`),
  CONSTRAINT `safety_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `safety_records_ibfk_2` FOREIGN KEY (`guest_donor_id`) REFERENCES `guest_donors` (`id`),
  CONSTRAINT `chk_safety_donor` CHECK ((((`user_id` is not null) and (`guest_donor_id` is null)) or ((`user_id` is null) and (`guest_donor_id` is not null))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `safety_records`
--

LOCK TABLES `safety_records` WRITE;
/*!40000 ALTER TABLE `safety_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `safety_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_profiles`
--

DROP TABLE IF EXISTS `student_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `college` varchar(200) DEFAULT NULL,
  `course` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `year` varchar(20) DEFAULT NULL,
  `division` varchar(20) DEFAULT NULL,
  `roll_no` varchar(50) DEFAULT NULL,
  `prn` varchar(100) DEFAULT NULL,
  `syllabus` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `institution_name` varchar(200) DEFAULT NULL,
  `id_card_image` varchar(500) DEFAULT NULL,
  `id_card_verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `student_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_profiles`
--

LOCK TABLES `student_profiles` WRITE;
/*!40000 ALTER TABLE `student_profiles` DISABLE KEYS */;
INSERT INTO `student_profiles` VALUES (1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-02 18:54:26','Demo College','data:image/png;base64,dGVzdA==',0);
/*!40000 ALTER TABLE `student_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trusted_contacts`
--

DROP TABLE IF EXISTS `trusted_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trusted_contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `relationship` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `trusted_contacts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trusted_contacts`
--

LOCK TABLES `trusted_contacts` WRITE;
/*!40000 ALTER TABLE `trusted_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `trusted_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','admin') DEFAULT 'student',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'MINEPTHE Test User','minepthe.test@gmail.com','6d987a391d90fc2451751b2bb85890fc6e452bc057f39a85d8d1fd552f965fb2','student','2026-09-26 18:54:44'),(2,'MINEPTHE Test User','minepthe_test_231554@example.com','$2b$10$qhfEeBmT72AAnZFMaQMyQ.T/1jDGuebtED8GjYm5GkZCO3l6FF8WC','student','2026-10-02 17:45:55'),(3,'MINEPTHE Administrator','admin@minepthe.com','$2b$12$hK5NADsfE2tVD8Q4sxxU2u.l54u98Jb9NlHbXY0K3Ft.D.eO8rVoe','admin','2026-10-02 19:14:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'minepthe'
--

--
-- Dumping routines for database 'minepthe'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-07 23:56:09
