-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2026 at 04:29 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smpdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `table_name` varchar(100) NOT NULL,
  `record_id` int(11) UNSIGNED DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `user_name`, `action`, `table_name`, `record_id`, `old_values`, `new_values`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', '', NULL),
(2, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(3, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'curl/8.11.0', NULL),
(4, 1, 'Spa Owner', 'create', 'bookings', 1, NULL, '{\"booking_code\":\"BK-20260505-001\",\"customer_id\":2,\"therapist_id\":1,\"service_id\":1,\"status\":\"pending\",\"booking_date\":\"2026-05-05\",\"start_time\":\"10:00\",\"end_time\":\"11:00\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"1\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(5, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(6, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(7, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(8, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(9, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(10, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(11, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(12, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(13, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(14, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(15, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(16, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(17, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(18, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(19, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(20, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(21, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(22, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(23, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(24, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(25, 2, 'Staff Resepsionis', 'create', 'bookings', 2, NULL, '{\"booking_code\":\"BK-20260503-001\",\"customer_id\":1,\"therapist_id\":1,\"service_id\":2,\"status\":\"pending\",\"booking_date\":\"2026-05-03\",\"start_time\":\"14:00\",\"end_time\":\"15:30\",\"source\":\"whatsapp\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(26, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(27, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(28, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(29, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(30, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(31, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(32, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(33, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(34, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(35, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(36, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(37, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(38, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(39, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(40, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(41, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(42, 2, 'Staff Resepsionis', 'create', 'bookings', 3, NULL, '{\"booking_code\":\"BK-20260504-001\",\"customer_id\":2,\"therapist_id\":1,\"service_id\":6,\"status\":\"pending\",\"booking_date\":\"2026-05-04\",\"start_time\":\"11:07\",\"end_time\":\"11:10\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(43, 2, 'Staff Resepsionis', 'create', 'bookings', 4, NULL, '{\"booking_code\":\"BK-20260503-002\",\"customer_id\":2,\"therapist_id\":1,\"service_id\":6,\"status\":\"pending\",\"booking_date\":\"2026-05-03\",\"start_time\":\"01:11\",\"end_time\":\"11:12\",\"source\":\"whatsapp\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(44, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(45, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(46, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(47, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(48, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(49, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(50, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(51, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(52, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(53, 2, 'Staff Resepsionis', 'create', 'bookings', 5, NULL, '{\"booking_code\":\"BK-20260510-001\",\"customer_id\":1,\"therapist_id\":1,\"service_id\":4,\"status\":\"pending\",\"booking_date\":\"2026-05-10\",\"start_time\":\"14:00\",\"end_time\":\"14:30\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(54, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(55, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(56, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(57, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(58, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(59, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(60, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(61, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(62, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(63, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(64, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(65, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(66, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(67, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(68, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(69, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(70, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(71, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(72, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(73, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(74, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(75, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(76, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(77, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(78, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(79, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(80, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(81, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(82, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(83, 1, 'Spa Owner', 'create', 'categories', 4, NULL, '{\"name\":\"Vitalitas\",\"description\":\"\",\"is_active\":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(84, 1, 'Spa Owner', 'delete', 'categories', 4, '{\"id\":\"4\",\"name\":\"Vitalitas\",\"description\":\"\",\"is_active\":\"1\",\"created_at\":\"2026-05-03 16:12:08\",\"updated_at\":\"2026-05-03 16:12:08\",\"deleted_at\":null}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(85, 1, 'Spa Owner', 'create', 'categories', 5, NULL, '{\"name\":\"das\",\"description\":\"\",\"is_active\":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(86, 1, 'Spa Owner', 'delete', 'categories', 5, '{\"id\":\"5\",\"name\":\"das\",\"description\":\"\",\"is_active\":\"1\",\"created_at\":\"2026-05-03 16:22:01\",\"updated_at\":\"2026-05-03 16:22:01\",\"deleted_at\":null}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(87, 1, 'Spa Owner', 'delete', 'bookings', 4, '{\"id\":\"4\",\"booking_code\":\"BK-20260503-002\",\"customer_id\":\"2\",\"therapist_id\":\"1\",\"service_id\":\"6\",\"status\":\"pending\",\"booking_date\":\"2026-05-03\",\"start_time\":\"01:11:00\",\"end_time\":\"11:12:00\",\"source\":\"whatsapp\",\"notes\":\"\",\"checked_in_at\":null,\"checked_out_at\":null,\"created_by\":\"2\",\"updated_by\":null,\"created_at\":\"2026-05-03 11:11:53\",\"updated_at\":\"2026-05-03 11:11:53\",\"deleted_at\":null}', '{\"status\":\"cancelled\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(88, 1, 'Spa Owner', 'delete', 'bookings', 1, '{\"id\":\"1\",\"booking_code\":\"BK-20260505-001\",\"customer_id\":\"2\",\"therapist_id\":\"1\",\"service_id\":\"1\",\"status\":\"pending\",\"booking_date\":\"2026-05-05\",\"start_time\":\"10:00:00\",\"end_time\":\"11:00:00\",\"source\":\"walk_in\",\"notes\":\"\",\"checked_in_at\":null,\"checked_out_at\":null,\"created_by\":\"1\",\"updated_by\":null,\"created_at\":\"2026-05-03 09:55:23\",\"updated_at\":\"2026-05-03 09:55:23\",\"deleted_at\":null}', '{\"status\":\"cancelled\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(89, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(90, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(91, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(92, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(93, 2, 'Staff Resepsionis', 'create', 'customers', 3, NULL, '{\"name\":\"agus safri\",\"phone\":\"09876544323\",\"email\":\"\",\"notes\":\"\",\"total_visits\":0,\"loyalty_points\":0,\"is_member\":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(94, 2, 'Staff Resepsionis', 'update', 'customers', 3, '{\"id\":\"3\",\"name\":\"agus safri\",\"phone\":\"09876544323\",\"email\":\"\",\"notes\":\"\",\"total_visits\":\"0\",\"loyalty_points\":\"0\",\"is_member\":\"1\",\"created_at\":\"2026-05-03 16:58:21\",\"updated_at\":\"2026-05-03 16:58:21\",\"deleted_at\":null}', '{\"name\":\"agus safri\",\"phone\":\"09876544323\",\"email\":\"\",\"notes\":\"\",\"is_member\":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(95, 2, 'Staff Resepsionis', 'create', 'bookings', 6, NULL, '{\"booking_code\":\"BK-20260503-001\",\"customer_id\":3,\"therapist_id\":1,\"service_id\":6,\"status\":\"pending\",\"booking_date\":\"2026-05-03\",\"start_time\":\"17:00\",\"end_time\":\"18:00\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(96, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(97, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(98, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(99, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(100, 2, 'Staff Resepsionis', 'delete', 'bookings', 6, '{\"id\":\"6\",\"booking_code\":\"BK-20260503-001\",\"customer_id\":\"3\",\"therapist_id\":\"1\",\"service_id\":\"6\",\"status\":\"pending\",\"booking_date\":\"2026-05-03\",\"start_time\":\"17:00:00\",\"end_time\":\"18:00:00\",\"source\":\"walk_in\",\"notes\":\"\",\"checked_in_at\":null,\"checked_out_at\":null,\"created_by\":\"2\",\"updated_by\":null,\"created_at\":\"2026-05-03 16:59:27\",\"updated_at\":\"2026-05-03 16:59:27\",\"deleted_at\":null}', '{\"status\":\"cancelled\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(101, 2, 'Staff Resepsionis', 'create', 'bookings', 7, NULL, '{\"booking_code\":\"BK-20260503-001\",\"customer_id\":3,\"therapist_id\":1,\"service_id\":6,\"status\":\"pending\",\"booking_date\":\"2026-05-03\",\"start_time\":\"18:00\",\"end_time\":\"19:00\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(102, 2, 'Staff Resepsionis', 'create', 'bookings', 8, NULL, '{\"booking_code\":\"BK-20260503-001\",\"customer_id\":3,\"therapist_id\":1,\"service_id\":6,\"status\":\"pending\",\"booking_date\":\"2026-05-03\",\"start_time\":\"18:59\",\"end_time\":\"19:00\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(103, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(104, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(105, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(106, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(107, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(108, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(109, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(110, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(111, 2, 'Staff Resepsionis', 'update', 'bookings', 8, '{\"id\":\"8\",\"booking_code\":\"BK-20260503-001\",\"customer_id\":\"3\",\"therapist_id\":\"1\",\"room_id\":null,\"service_id\":\"6\",\"status\":\"confirmed\",\"booking_date\":\"2026-05-03\",\"start_time\":\"18:59:00\",\"end_time\":\"19:00:00\",\"source\":\"walk_in\",\"notes\":\"\",\"checked_in_at\":\"2026-05-03 17:11:00\",\"checked_out_at\":null,\"created_by\":\"2\",\"updated_by\":\"2\",\"created_at\":\"2026-05-03 17:10:36\",\"updated_at\":\"2026-05-03 17:11:00\",\"deleted_at\":null}', '{\"updated_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(112, 2, 'Staff Resepsionis', 'update', 'bookings', 8, '{\"id\":\"8\",\"booking_code\":\"BK-20260503-001\",\"customer_id\":\"3\",\"therapist_id\":\"1\",\"room_id\":null,\"service_id\":\"6\",\"status\":\"confirmed\",\"booking_date\":\"2026-05-03\",\"start_time\":\"18:59:00\",\"end_time\":\"19:00:00\",\"source\":\"walk_in\",\"notes\":\"\",\"checked_in_at\":\"2026-05-03 17:11:00\",\"checked_out_at\":null,\"created_by\":\"2\",\"updated_by\":\"2\",\"created_at\":\"2026-05-03 17:10:36\",\"updated_at\":\"2026-05-04 11:16:32\",\"deleted_at\":null}', '{\"updated_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(113, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(114, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(115, 1, 'Spa Owner', 'create', 'rooms', 5, NULL, '{\"name\":\"Ruang Test Playwright\",\"status\":\"active\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(116, 1, 'Spa Owner', 'create', 'rooms', 6, NULL, '{\"name\":\"Ruang Test Baru\",\"status\":\"active\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(117, 1, 'Spa Owner', 'update', 'rooms', 5, '{\"id\":\"5\",\"name\":\"Ruang Test Playwright\",\"status\":\"active\",\"created_at\":\"2026-05-04 11:27:17\",\"updated_at\":\"2026-05-04 11:27:17\",\"deleted_at\":null}', '{\"name\":\"Ruang Edited Test\",\"status\":\"inactive\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(118, 1, 'Spa Owner', 'delete', 'rooms', 6, '{\"id\":\"6\",\"name\":\"Ruang Test Baru\",\"status\":\"active\",\"created_at\":\"2026-05-04 11:28:26\",\"updated_at\":\"2026-05-04 11:28:26\",\"deleted_at\":null}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(119, 2, 'Staff Resepsionis', 'delete', 'rooms', 5, '{\"id\":\"5\",\"name\":\"Ruang Edited Test\",\"status\":\"inactive\",\"created_at\":\"2026-05-04 11:27:17\",\"updated_at\":\"2026-05-04 11:28:49\",\"deleted_at\":null}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(120, 2, 'Staff Resepsionis', 'update', 'rooms', 3, '{\"id\":\"3\",\"name\":\"Ruang VIP\",\"status\":\"active\",\"created_at\":\"2026-05-03 17:25:12\",\"updated_at\":\"2026-05-03 17:25:12\",\"deleted_at\":null}', '{\"name\":\"Ruang VIP n\",\"status\":\"active\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(121, 2, 'Staff Resepsionis', 'update', 'rooms', 3, '{\"id\":\"3\",\"name\":\"Ruang VIP n\",\"status\":\"active\",\"created_at\":\"2026-05-03 17:25:12\",\"updated_at\":\"2026-05-04 11:47:11\",\"deleted_at\":null}', '{\"name\":\"Ruang VIP\",\"status\":\"active\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(122, 2, 'Staff Resepsionis', 'create', 'bookings', 9, NULL, '{\"booking_code\":\"BK-20260504-001\",\"customer_id\":3,\"therapist_id\":1,\"service_id\":6,\"status\":\"pending\",\"booking_date\":\"2026-05-04\",\"start_time\":\"01:00\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(123, 2, 'Staff Resepsionis', 'create', 'bookings', 10, NULL, '{\"booking_code\":\"BK-20260504-001\",\"customer_id\":3,\"therapist_id\":1,\"service_id\":6,\"status\":\"pending\",\"booking_date\":\"2026-05-04\",\"start_time\":\"13:00\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(124, 2, 'Staff Resepsionis', 'create', 'bookings', 11, NULL, '{\"booking_code\":\"BK-20260504-001\",\"customer_id\":3,\"therapist_id\":1,\"room_id\":1,\"service_id\":6,\"status\":\"pending\",\"booking_date\":\"2026-05-04\",\"start_time\":\"13:00\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(125, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(126, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(127, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(128, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(129, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(130, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(131, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(132, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(133, 2, 'Staff Resepsionis', 'create', 'customers', 4, NULL, '{\"name\":\"kustomer 1\",\"phone\":\"08797556756\",\"email\":\"demo@rekanonline.com\",\"notes\":\"\",\"total_visits\":0,\"loyalty_points\":0,\"is_member\":0}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(134, 2, 'Staff Resepsionis', 'update', 'customers', 4, '{\"id\":\"4\",\"name\":\"kustomer 1\",\"phone\":\"08797556756\",\"email\":\"demo@rekanonline.com\",\"notes\":\"\",\"total_visits\":\"0\",\"loyalty_points\":\"0\",\"is_member\":\"0\",\"created_at\":\"2026-05-04 12:17:26\",\"updated_at\":\"2026-05-04 12:17:26\",\"deleted_at\":null}', '{\"name\":\"kustomer 1\",\"phone\":\"08797556756\",\"email\":\"demo@rekanonline.com\",\"notes\":\"\",\"is_member\":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(135, 2, 'Staff Resepsionis', 'create', 'bookings', 12, NULL, '{\"booking_code\":\"BK-20260504-002\",\"customer_id\":4,\"therapist_id\":1,\"room_id\":2,\"service_id\":6,\"status\":\"pending\",\"booking_date\":\"2026-05-04\",\"start_time\":\"13:30\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(136, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(137, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(138, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(139, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(140, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(141, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', NULL),
(142, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(143, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(144, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(145, 1, 'Spa Owner', 'create', 'bookings', 14, NULL, '{\"booking_code\":\"BK-20260510-002\",\"customer_id\":3,\"therapist_id\":1,\"room_id\":1,\"service_id\":1,\"status\":\"pending\",\"booking_date\":\"2026-05-10\",\"start_time\":\"10:00\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"1\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(146, 2, 'Staff Resepsionis', 'update', 'customers', 3, '{\"id\":\"3\",\"name\":\"agus safri\",\"phone\":\"09876544323\",\"email\":\"\",\"notes\":\"\",\"total_visits\":\"0\",\"loyalty_points\":\"0\",\"is_member\":\"1\",\"created_at\":\"2026-05-03 16:58:21\",\"updated_at\":\"2026-05-03 16:58:42\",\"deleted_at\":null}', '{\"name\":\"agus safri\",\"phone\":\"085659738110\",\"email\":\"\",\"notes\":\"\",\"is_member\":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(147, 2, 'Staff Resepsionis', 'create', 'bookings', 15, NULL, '{\"booking_code\":\"BK-20260508-001\",\"customer_id\":3,\"therapist_id\":1,\"room_id\":1,\"service_id\":6,\"status\":\"pending\",\"booking_date\":\"2026-05-08\",\"start_time\":\"11:42\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(148, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(149, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(150, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(151, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(152, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(153, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(154, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(155, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(156, 2, 'Staff Resepsionis', 'create', 'transactions', 2, NULL, '{\"transaction_code\":\"TX-20260508-001\",\"booking_id\":15,\"customer_id\":\"3\",\"staff_id\":\"2\",\"therapist_id\":\"1\",\"service_id\":\"6\",\"subtotal\":165000,\"discount\":50000,\"total_amount\":115000,\"payment_method\":\"cash\",\"payment_status\":\"paid\",\"commission_amount\":34500,\"net_revenue\":80500,\"paid_at\":\"2026-05-08 11:27:33\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(157, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(158, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(159, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(160, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(161, 2, 'Staff Resepsionis', 'create', 'bookings', 16, NULL, '{\"booking_code\":\"BK-20260509-001\",\"customer_id\":3,\"therapist_id\":1,\"room_id\":1,\"service_id\":5,\"status\":\"pending\",\"booking_date\":\"2026-05-09\",\"start_time\":\"00:38\",\"source\":\"walk_in\",\"notes\":\"pijat premium\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(162, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(163, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(164, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(165, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(166, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(167, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(168, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(169, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(170, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(171, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(172, 2, 'Staff Resepsionis', 'create', 'transactions', 3, NULL, '{\"transaction_code\":\"TX-20260509-001\",\"booking_id\":16,\"customer_id\":\"3\",\"staff_id\":\"2\",\"therapist_id\":\"1\",\"service_id\":\"5\",\"subtotal\":180000,\"discount\":0,\"total_amount\":180000,\"payment_method\":\"cash\",\"payment_status\":\"paid\",\"commission_amount\":54000,\"net_revenue\":126000,\"paid_at\":\"2026-05-09 11:07:39\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(173, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(174, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(175, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'curl/8.11.0', NULL),
(176, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(177, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(178, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(179, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(180, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(181, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(182, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(183, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'curl/8.11.0', NULL),
(184, 1, 'Spa Owner', 'create', 'bookings', 17, NULL, '{\"booking_code\":\"BK-20260510-001\",\"customer_id\":3,\"therapist_id\":1,\"room_id\":1,\"service_id\":6,\"status\":\"pending\",\"booking_date\":\"2026-05-10\",\"start_time\":\"00:00\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"1\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(185, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(186, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(187, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(188, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(189, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(190, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(191, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(192, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(193, 2, 'Staff Resepsionis', 'create', 'transactions', 4, NULL, '{\"transaction_code\":\"TX-20260510-001\",\"booking_id\":17,\"customer_id\":\"3\",\"staff_id\":\"2\",\"therapist_id\":\"1\",\"service_id\":\"6\",\"subtotal\":165000,\"discount\":0,\"total_amount\":165000,\"payment_method\":\"cash\",\"payment_status\":\"paid\",\"commission_amount\":49500,\"net_revenue\":115500,\"paid_at\":\"2026-05-10 11:39:45\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(194, 2, 'Staff Resepsionis', 'create', 'bookings', 18, NULL, '{\"booking_code\":\"BK-20260510-002\",\"customer_id\":2,\"therapist_id\":1,\"room_id\":2,\"service_id\":5,\"status\":\"pending\",\"booking_date\":\"2026-05-10\",\"start_time\":\"00:39\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(195, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(196, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(197, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(198, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(199, 2, 'Staff Resepsionis', 'create', 'bookings', 19, NULL, '{\"booking_code\":\"BK-20260510-003\",\"customer_id\":2,\"therapist_id\":1,\"room_id\":4,\"service_id\":5,\"status\":\"pending\",\"booking_date\":\"2026-05-10\",\"start_time\":\"13:00\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(200, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(201, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(202, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(203, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(204, 2, 'Staff Resepsionis', 'create', 'transactions', 5, NULL, '{\"transaction_code\":\"TX-20260510-002\",\"booking_id\":19,\"customer_id\":\"2\",\"staff_id\":\"2\",\"therapist_id\":\"1\",\"service_id\":\"5\",\"subtotal\":180000,\"discount\":0,\"tax_amount\":19800,\"total_amount\":199800,\"payment_method\":\"cash\",\"payment_status\":\"paid\",\"commission_amount\":54000,\"net_revenue\":126000,\"paid_at\":\"2026-05-10 12:05:46\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(205, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(206, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(207, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(208, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(209, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL);
INSERT INTO `audit_logs` (`id`, `user_id`, `user_name`, `action`, `table_name`, `record_id`, `old_values`, `new_values`, `ip_address`, `user_agent`, `created_at`) VALUES
(210, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(211, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(212, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(213, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(214, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(215, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(216, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(217, 1, 'Spa Owner', 'update', 'therapists', 1, '{\"id\":\"1\",\"name\":\"Sari Dewi\",\"phone\":\"081234567890\",\"specialty\":\"Pijat Relaksasi, Reflexology\",\"commission_rate\":\"30.00\",\"status\":\"active\",\"avatar_path\":null,\"notes\":null,\"created_at\":null,\"updated_at\":null,\"deleted_at\":null}', '{\"name\":\"Sari Dewi\",\"phone\":\"081234567890\",\"specialty\":\"Pijat Relaksasi, Reflexology\",\"commission_rate\":35,\"status\":\"active\",\"notes\":\"\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(218, 1, 'Spa Owner', 'update', 'therapists', 1, '{\"id\":\"1\",\"name\":\"Sari Dewi\",\"phone\":\"081234567890\",\"specialty\":\"Pijat Relaksasi, Reflexology\",\"commission_rate\":\"35.00\",\"status\":\"active\",\"avatar_path\":null,\"notes\":\"\",\"created_at\":null,\"updated_at\":\"2026-05-11 08:40:44\",\"deleted_at\":null}', '{\"name\":\"Sari Dewi\",\"phone\":\"081234567890\",\"specialty\":\"Pijat Relaksasi, Reflexology\",\"commission_rate\":\"\",\"status\":\"active\",\"notes\":\"\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(219, 1, 'Spa Owner', 'create', 'therapists', 2, NULL, '{\"name\":\"Rina Sari\",\"phone\":\"081298765432\",\"specialty\":\"\",\"commission_rate\":25,\"status\":\"active\",\"avatar_path\":null,\"notes\":\"\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(220, 1, 'Spa Owner', 'create', 'therapists', 3, NULL, '{\"name\":\"Test Error\",\"phone\":\"0812\",\"specialty\":null,\"commission_rate\":25,\"status\":\"active\",\"avatar_path\":null,\"notes\":null}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(221, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(222, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(223, 2, 'Staff Resepsionis', 'delete', 'therapists', 3, '{\"id\":\"3\",\"name\":\"Test Error\",\"phone\":\"0812\",\"specialty\":null,\"commission_rate\":\"25.00\",\"status\":\"active\",\"avatar_path\":null,\"notes\":null,\"created_at\":\"2026-05-11 09:00:31\",\"updated_at\":\"2026-05-11 09:00:31\",\"deleted_at\":null}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(224, 2, 'Staff Resepsionis', 'delete', 'therapists', 2, '{\"id\":\"2\",\"name\":\"Rina Sari\",\"phone\":\"081298765432\",\"specialty\":\"\",\"commission_rate\":\"25.00\",\"status\":\"active\",\"avatar_path\":null,\"notes\":\"\",\"created_at\":\"2026-05-11 08:59:49\",\"updated_at\":\"2026-05-11 08:59:49\",\"deleted_at\":null}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(225, 2, 'Staff Resepsionis', 'update', 'therapists', 1, '{\"id\":\"1\",\"name\":\"Sari Dewi\",\"phone\":\"081234567890\",\"specialty\":\"Pijat Relaksasi, Reflexology\",\"commission_rate\":\"35.00\",\"status\":\"active\",\"avatar_path\":null,\"notes\":\"\",\"created_at\":null,\"updated_at\":\"2026-05-11 08:40:44\",\"deleted_at\":null}', '{\"name\":\"Sari Dewi\",\"phone\":\"081234567890\",\"specialty\":\"Pijat Relaksasi, Reflexology\",\"status\":\"active\",\"notes\":\"\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(226, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(227, 2, 'Staff Resepsionis', 'create', 'therapists', 4, NULL, '{\"name\":\"Maya Putri\",\"phone\":\"081311223344\",\"specialty\":\"\",\"commission_rate\":25,\"status\":\"active\",\"avatar_path\":null,\"notes\":\"\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(228, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', NULL),
(229, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', NULL),
(230, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', NULL),
(231, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', NULL),
(232, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', NULL),
(233, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', NULL),
(234, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(235, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(236, 1, 'Spa Owner', 'create', 'therapists', 5, NULL, '{\"name\":\"Dewi Lestari\",\"phone\":\"081556677889\",\"specialty\":\"\",\"commission_rate\":25,\"status\":\"active\",\"avatar_path\":null,\"notes\":\"\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(237, 1, 'Spa Owner', 'delete', 'therapists', 5, '{\"id\":\"5\",\"name\":\"Dewi Lestari\",\"phone\":\"081556677889\",\"specialty\":\"\",\"commission_rate\":\"25.00\",\"status\":\"active\",\"avatar_path\":null,\"notes\":\"\",\"created_at\":\"2026-05-11 09:16:59\",\"updated_at\":\"2026-05-11 09:16:59\",\"deleted_at\":null}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(238, 1, 'Spa Owner', 'delete', 'therapists', 4, '{\"id\":\"4\",\"name\":\"Maya Putri\",\"phone\":\"081311223344\",\"specialty\":\"\",\"commission_rate\":\"25.00\",\"status\":\"active\",\"avatar_path\":null,\"notes\":\"\",\"created_at\":\"2026-05-11 09:06:51\",\"updated_at\":\"2026-05-11 09:06:51\",\"deleted_at\":null}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(239, 1, 'Spa Owner', 'create', 'therapists', 6, NULL, '{\"name\":\"abc\",\"phone\":\"09876544323\",\"specialty\":\"Pijat Relaksasi, Reflexology\",\"commission_rate\":25,\"status\":\"active\",\"avatar_path\":null,\"notes\":\"\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(240, 1, 'Spa Owner', 'delete', 'therapists', 6, '{\"id\":\"6\",\"name\":\"abc\",\"phone\":\"09876544323\",\"specialty\":\"Pijat Relaksasi, Reflexology\",\"commission_rate\":\"25.00\",\"status\":\"active\",\"avatar_path\":null,\"notes\":\"\",\"created_at\":\"2026-05-11 09:29:40\",\"updated_at\":\"2026-05-11 09:29:40\",\"deleted_at\":null}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(241, 1, 'Spa Owner', 'create', 'therapists', 7, NULL, '{\"name\":\"abc\",\"phone\":\"09876544323\",\"specialty\":\"Pijat Relaksasi, Reflexology\",\"commission_rate\":10,\"status\":\"active\",\"avatar_path\":null,\"notes\":\"\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(242, 1, 'Spa Owner', 'delete', 'therapists', 7, '{\"id\":\"7\",\"name\":\"abc\",\"phone\":\"09876544323\",\"specialty\":\"Pijat Relaksasi, Reflexology\",\"commission_rate\":\"10.00\",\"status\":\"active\",\"avatar_path\":null,\"notes\":\"\",\"created_at\":\"2026-05-11 09:30:28\",\"updated_at\":\"2026-05-11 09:30:28\",\"deleted_at\":null}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(243, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(244, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(245, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(246, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(247, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(248, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(249, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(250, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(251, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(252, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(253, 2, 'Staff Resepsionis', 'create', 'customers', 5, NULL, '{\"name\":\"Budi Santoso\",\"phone\":\"081234567890\",\"email\":\"budi@example.com\",\"notes\":\"Alergi minyak lavender\",\"total_visits\":0,\"loyalty_points\":0,\"is_member\":0}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(254, 2, 'Staff Resepsionis', 'create', 'bookings', 20, NULL, '{\"booking_code\":\"BK-20260511-0001\",\"customer_id\":4,\"therapist_id\":1,\"room_id\":1,\"service_id\":4,\"status\":\"pending\",\"booking_date\":\"2026-05-11\",\"start_time\":\"11:43\",\"end_time\":\"12:13:00\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(255, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(256, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(257, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(258, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(259, 2, 'Staff Resepsionis', 'create', 'transactions', 6, NULL, '{\"transaction_code\":\"TX-20260511-0001\",\"booking_id\":20,\"customer_id\":\"4\",\"staff_id\":\"2\",\"therapist_id\":\"1\",\"service_id\":\"4\",\"subtotal\":75000,\"discount\":0,\"tax_amount\":8250,\"total_amount\":83250,\"payment_method\":\"cash\",\"payment_status\":\"paid\",\"commission_amount\":26250,\"net_revenue\":48750,\"paid_at\":\"2026-05-11 11:46:43\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(260, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(261, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', NULL),
(262, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 11:55:24'),
(263, 2, 'Staff Resepsionis', 'create', 'bookings', 21, NULL, '{\"booking_code\":\"BK-20260511-0002\",\"customer_id\":4,\"therapist_id\":1,\"room_id\":2,\"service_id\":3,\"status\":\"pending\",\"booking_date\":\"2026-05-11\",\"start_time\":\"11:55\",\"end_time\":\"12:40:00\",\"source\":\"walk_in\",\"notes\":\"\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 11:55:52'),
(264, 2, 'Staff Resepsionis', 'update_status', 'bookings', 21, '{\"id\":\"21\",\"booking_code\":\"BK-20260511-0002\",\"customer_id\":\"4\",\"therapist_id\":\"1\",\"room_id\":\"2\",\"service_id\":\"3\",\"status\":\"pending\",\"booking_date\":\"2026-05-11\",\"start_time\":\"11:55:00\",\"end_time\":\"12:40:00\",\"source\":\"walk_in\",\"notes\":\"\",\"checked_in_at\":null,\"checked_out_at\":null,\"created_by\":\"2\",\"updated_by\":null,\"created_at\":\"2026-05-11 11:55:52\",\"updated_at\":\"2026-05-11 11:55:52\",\"deleted_at\":null}', '{\"status\":\"confirmed\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 11:56:17'),
(265, 2, 'Staff Resepsionis', 'logout', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 11:56:31'),
(266, 3, 'Sari Dewi', 'login', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 11:56:31'),
(267, 3, 'Sari Dewi', 'update_treatment_status', 'bookings', 21, '{\"id\":\"21\",\"booking_code\":\"BK-20260511-0002\",\"customer_id\":\"4\",\"therapist_id\":\"1\",\"room_id\":\"2\",\"service_id\":\"3\",\"status\":\"confirmed\",\"booking_date\":\"2026-05-11\",\"start_time\":\"11:55:00\",\"end_time\":\"12:40:00\",\"source\":\"walk_in\",\"notes\":\"\",\"checked_in_at\":null,\"checked_out_at\":null,\"created_by\":\"2\",\"updated_by\":\"2\",\"created_at\":\"2026-05-11 11:55:52\",\"updated_at\":\"2026-05-11 11:56:17\",\"deleted_at\":null}', '{\"updated_by\":\"3\",\"status\":\"in_progress\",\"checked_in_at\":\"2026-05-11 11:56:32\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 11:56:32'),
(268, 3, 'Sari Dewi', 'update_treatment_status', 'bookings', 21, '{\"id\":\"21\",\"booking_code\":\"BK-20260511-0002\",\"customer_id\":\"4\",\"therapist_id\":\"1\",\"room_id\":\"2\",\"service_id\":\"3\",\"status\":\"in_progress\",\"booking_date\":\"2026-05-11\",\"start_time\":\"11:55:00\",\"end_time\":\"12:40:00\",\"source\":\"walk_in\",\"notes\":\"\",\"checked_in_at\":\"2026-05-11 11:56:32\",\"checked_out_at\":null,\"created_by\":\"2\",\"updated_by\":\"3\",\"created_at\":\"2026-05-11 11:55:52\",\"updated_at\":\"2026-05-11 11:56:32\",\"deleted_at\":null}', '{\"updated_by\":\"3\",\"status\":\"awaiting_payment\",\"end_time\":\"11:56:32\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 11:56:32'),
(269, 3, 'Sari Dewi', 'logout', 'users', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 11:56:47'),
(270, 2, 'Staff Resepsionis', 'login', 'users', 2, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 11:56:47'),
(271, 2, 'Staff Resepsionis', 'create', 'transactions', 7, NULL, '{\"transaction_code\":\"TX-20260511-0002\",\"booking_id\":21,\"customer_id\":\"4\",\"staff_id\":\"2\",\"therapist_id\":\"1\",\"service_id\":\"3\",\"subtotal\":100000,\"discount\":0,\"tax_amount\":11000,\"total_amount\":111000,\"payment_method\":\"cash\",\"payment_status\":\"paid\",\"commission_amount\":35000,\"net_revenue\":65000,\"paid_at\":\"2026-05-11 11:56:47\",\"created_by\":\"2\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 11:56:47'),
(272, 2, 'Staff Resepsionis', 'update_status', 'bookings', 21, '{\"status\":\"awaiting_payment\"}', '{\"status\":\"completed\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 11:56:47'),
(273, 1, 'Spa Owner', 'delete', 'users', 9, '{\"username\":\"abcd\",\"full_name\":\"abc\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:21:59'),
(274, 1, 'Spa Owner', 'delete', 'users', 8, '{\"username\":\"abc\",\"full_name\":\"abc\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:22:01'),
(275, 1, 'Spa Owner', 'delete', 'users', 7, '{\"username\":\"dewilestari\",\"full_name\":\"Dewi Lestari\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:22:16'),
(276, 1, 'Spa Owner', 'delete', 'users', 6, '{\"username\":\"mayaputri\",\"full_name\":\"Maya Putri\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:22:18'),
(277, 1, 'Spa Owner', 'delete', 'users', 5, '{\"username\":\"testerror123\",\"full_name\":\"Test Error\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:22:20'),
(278, 1, 'Spa Owner', 'delete', 'users', 4, '{\"username\":\"rinasari\",\"full_name\":\"Rina Sari\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:22:22'),
(279, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:31:35'),
(280, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:32:17'),
(281, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:34:01'),
(282, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:35:15'),
(283, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:36:06'),
(284, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:36:19'),
(285, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:36:45'),
(286, 1, 'Spa Owner', 'update', 'categories', 1, '{\"id\":\"1\",\"name\":\"Relaksasi\",\"description\":\"Layanan pijat relaksasi untuk mengurangi stres\",\"is_active\":\"1\",\"created_at\":null,\"updated_at\":null,\"deleted_at\":null}', '{\"name\":\"Test Edit\",\"description\":\"Layanan pijat relaksasi untuk mengurangi stres\",\"is_active\":\"1\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:45:34'),
(287, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:56:27'),
(288, 1, 'Spa Owner', 'update', 'categories', 1, '{\"id\":\"1\",\"name\":\"Test Edit\",\"description\":\"Layanan pijat relaksasi untuk mengurangi stres\",\"is_active\":\"1\",\"created_at\":null,\"updated_at\":\"2026-05-11 12:45:34\",\"deleted_at\":null}', '{\"name\":\"Relaksasi\",\"description\":\"Layanan pijat relaksasi untuk mengurangi stres\",\"is_active\":\"1\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 12:58:28'),
(289, 1, 'Spa Owner', 'update', 'categories', 1, '{\"id\":\"1\",\"name\":\"Relaksasi\",\"description\":\"Layanan pijat relaksasi untuk mengurangi stres\",\"is_active\":\"1\",\"created_at\":null,\"updated_at\":\"2026-05-11 12:58:28\",\"deleted_at\":null}', '{\"name\":\"Relaksasi\",\"description\":\"Layanan pijat relaksasi untuk mengurangi stres\",\"is_active\":\"1\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 13:00:16'),
(290, 1, 'Spa Owner', 'update', 'categories', 1, '{\"id\":\"1\",\"name\":\"Relaksasi\",\"description\":\"Layanan pijat relaksasi untuk mengurangi stres\",\"is_active\":\"1\",\"created_at\":null,\"updated_at\":\"2026-05-11 12:58:28\",\"deleted_at\":null}', '{\"name\":\"Relaksasi new\",\"description\":\"Layanan pijat relaksasi untuk mengurangi stres\",\"is_active\":\"1\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 13:00:23'),
(291, 1, 'Spa Owner', 'update', 'categories', 1, '{\"id\":\"1\",\"name\":\"Relaksasi new\",\"description\":\"Layanan pijat relaksasi untuk mengurangi stres\",\"is_active\":\"1\",\"created_at\":null,\"updated_at\":\"2026-05-11 13:00:23\",\"deleted_at\":null}', '{\"name\":\"Relaksasi\",\"description\":\"Layanan pijat relaksasi untuk mengurangi stres\",\"is_active\":\"1\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 13:00:26'),
(292, 1, 'Spa Owner', 'update', 'categories', 1, '{\"id\":\"1\",\"name\":\"Relaksasi\",\"description\":\"Layanan pijat relaksasi untuk mengurangi stres\",\"is_active\":\"1\",\"created_at\":null,\"updated_at\":\"2026-05-11 13:00:26\",\"deleted_at\":null}', '{\"name\":\"Relaksasi\",\"description\":\"Layanan pijat relaksasi untuk mengurangi stres\",\"is_active\":\"1\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36', '2026-05-11 13:00:28'),
(293, 1, 'Spa Owner', 'login', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-05-12 08:17:30'),
(294, 1, 'Spa Owner', 'create', 'categories', 6, NULL, '{\"name\":\"layanan kesehatan\",\"description\":\"deskripsi layanan\",\"is_active\":\"1\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-05-12 08:17:57'),
(295, 1, 'Spa Owner', 'create', 'services', 7, NULL, '{\"name\":\"relaksasi\",\"category_id\":\"6\",\"description\":\"deskripsi layanan\",\"duration_minutes\":50,\"price\":199999,\"is_active\":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-05-12 08:18:31'),
(296, 1, 'Spa Owner', 'update', 'services', 7, '{\"id\":\"7\",\"name\":\"relaksasi\",\"category_id\":\"6\",\"description\":\"deskripsi layanan\",\"duration_minutes\":\"50\",\"price\":\"199999.00\",\"is_active\":\"1\",\"created_at\":\"2026-05-12 08:18:31\",\"updated_at\":\"2026-05-12 08:18:31\",\"deleted_at\":null}', '{\"name\":\"relaksasi\",\"category_id\":\"6\",\"description\":\"deskripsi layanan\",\"duration_minutes\":50,\"price\":200000}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-05-12 08:18:43'),
(297, 1, 'Spa Owner', 'create', 'therapists', 8, NULL, '{\"name\":\"dewi ari\",\"phone\":\"081234567890\",\"specialty\":\"Pijat Relaksasi, Reflexology\",\"commission_rate\":15,\"status\":\"active\",\"avatar_path\":null,\"notes\":\"deskripsi terapis\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-05-12 08:19:48'),
(298, 1, 'Spa Owner', 'create', 'rooms', 7, NULL, '{\"name\":\"ruang 3\",\"status\":\"active\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-05-12 08:20:03'),
(299, 1, 'Spa Owner', 'update', 'rooms', 7, '{\"id\":\"7\",\"name\":\"ruang 3\",\"status\":\"active\",\"created_at\":\"2026-05-12 08:20:03\",\"updated_at\":\"2026-05-12 08:20:03\",\"deleted_at\":null}', '{\"name\":\"Ruang 3\",\"status\":\"active\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-05-12 08:20:11'),
(300, 1, 'Spa Owner', 'update', 'services', 7, '{\"id\":\"7\",\"name\":\"relaksasi\",\"category_id\":\"6\",\"description\":\"deskripsi layanan\",\"duration_minutes\":\"50\",\"price\":\"200000.00\",\"is_active\":\"1\",\"created_at\":\"2026-05-12 08:18:31\",\"updated_at\":\"2026-05-12 08:18:43\",\"deleted_at\":null}', '{\"name\":\"relaksasi\",\"category_id\":\"6\",\"description\":\"deskripsi layanan\",\"duration_minutes\":50,\"price\":200000}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-05-12 08:37:48'),
(301, 1, 'Spa Owner', 'logout', 'users', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '2026-05-12 09:17:52');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) UNSIGNED NOT NULL,
  `booking_code` varchar(20) NOT NULL,
  `customer_id` int(11) UNSIGNED NOT NULL,
  `therapist_id` int(11) UNSIGNED DEFAULT NULL,
  `room_id` int(11) UNSIGNED DEFAULT NULL,
  `service_id` int(11) UNSIGNED DEFAULT NULL,
  `status` enum('pending','confirmed','in_progress','awaiting_payment','completed','cancelled','no_show') DEFAULT 'pending',
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `source` enum('walk_in','whatsapp','phone','online') NOT NULL DEFAULT 'walk_in',
  `notes` text DEFAULT NULL,
  `checked_in_at` datetime DEFAULT NULL,
  `checked_out_at` datetime DEFAULT NULL,
  `created_by` int(11) UNSIGNED NOT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `booking_code`, `customer_id`, `therapist_id`, `room_id`, `service_id`, `status`, `booking_date`, `start_time`, `end_time`, `source`, `notes`, `checked_in_at`, `checked_out_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(15, 'BK-20260508-001', 3, 1, 1, 6, 'completed', '2026-05-08', '11:42:00', NULL, 'walk_in', '', '2026-05-08 10:43:31', '2026-05-08 11:08:20', 2, 2, '2026-05-08 10:41:34', '2026-05-08 11:27:33', NULL),
(16, 'BK-20260509-001', 3, 1, 1, 5, 'completed', '2026-05-09', '00:38:00', '10:51:06', 'walk_in', 'pijat premium', '2026-05-09 10:47:28', NULL, 2, 2, '2026-05-09 10:37:00', '2026-05-09 11:07:39', NULL),
(17, 'BK-20260510-001', 3, 1, 1, 6, 'completed', '2026-05-10', '00:00:00', '11:30:49', 'walk_in', '', '2026-05-10 11:18:39', NULL, 1, 2, '2026-05-10 11:00:57', '2026-05-10 11:39:45', NULL),
(18, 'BK-20260510-002', 2, 1, 2, 5, 'pending', '2026-05-10', '00:39:00', NULL, 'walk_in', '', NULL, NULL, 2, NULL, '2026-05-10 11:40:11', '2026-05-10 11:40:11', NULL),
(19, 'BK-20260510-003', 2, 1, 4, 5, 'completed', '2026-05-10', '13:00:00', '12:04:26', 'walk_in', '', '2026-05-10 12:03:51', NULL, 2, 2, '2026-05-10 12:03:33', '2026-05-10 12:05:46', NULL),
(20, 'BK-20260511-0001', 4, 1, 1, 4, 'completed', '2026-05-11', '11:43:00', '11:45:59', 'walk_in', '', '2026-05-11 11:45:36', NULL, 2, 2, '2026-05-11 11:44:10', '2026-05-11 11:46:44', NULL),
(21, 'BK-20260511-0002', 4, 1, 2, 3, 'completed', '2026-05-11', '11:55:00', '11:56:32', 'walk_in', '', '2026-05-11 11:56:32', NULL, 2, 2, '2026-05-11 11:55:52', '2026-05-11 11:56:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `booking_services`
--

CREATE TABLE `booking_services` (
  `id` int(11) UNSIGNED NOT NULL,
  `booking_id` int(11) UNSIGNED NOT NULL,
  `service_id` int(11) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_services`
--

INSERT INTO `booking_services` (`id`, `booking_id`, `service_id`, `created_at`) VALUES
(4, 15, 6, '2026-05-08 10:41:34'),
(5, 15, 4, '2026-05-08 10:41:34'),
(6, 15, 1, '2026-05-08 10:41:34'),
(7, 16, 5, '2026-05-09 10:37:00'),
(8, 16, 4, '2026-05-09 10:37:00'),
(9, 17, 6, '2026-05-10 11:00:57'),
(10, 17, 1, '2026-05-10 11:00:57'),
(11, 17, 3, '2026-05-10 11:00:57'),
(12, 18, 5, '2026-05-10 11:40:11'),
(13, 18, 2, '2026-05-10 11:40:11'),
(14, 19, 5, '2026-05-10 12:03:33'),
(15, 19, 2, '2026-05-10 12:03:33'),
(16, 20, 4, '2026-05-11 11:44:10'),
(17, 21, 3, '2026-05-11 11:55:52');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Relaksasi', 'Layanan pijat relaksasi untuk mengurangi stres', 1, NULL, '2026-05-11 13:00:26', NULL),
(2, 'Medis', 'Layanan pijat terapi medis', 1, NULL, NULL, NULL),
(3, 'Kecantikan', 'Layanan perawatan kecantikan', 1, NULL, NULL, NULL),
(6, 'layanan kesehatan', 'deskripsi layanan', 1, '2026-05-12 08:17:57', '2026-05-12 08:17:57', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ci_sessions`
--

CREATE TABLE `ci_sessions` (
  `id` varchar(128) NOT NULL,
  `ip_address` varchar(45) NOT NULL DEFAULT '0',
  `timestamp` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `data` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ci_sessions`
--

INSERT INTO `ci_sessions` (`id`, `ip_address`, `timestamp`, `data`) VALUES
('smp_session:025c69c98536e3abb60104c522fe348d', '::1', 4294967295, 0x757365725f69647c733a313a2231223b757365725f6e616d657c733a393a22537061204f776e6572223b757365725f726f6c657c733a353a226f776e6572223b757365726e616d657c733a353a226f776e6572223b7468657261706973745f69647c4e3b);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `total_visits` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `loyalty_points` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `is_member` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `phone`, `email`, `notes`, `total_visits`, `loyalty_points`, `is_member`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Budi Santoso', '081111222333', 'budi@email.com', 'Preferensi tekanan sedang', 3, 30, 1, '2026-05-03 09:07:11', '2026-05-03 09:07:11', NULL),
(2, 'Ani Wijaya', '082222333444', 'ani@email.com', 'Alergi minyak lavender', 1, 10, 0, '2026-05-03 09:07:11', '2026-05-03 09:07:11', NULL),
(3, 'agus safri', '085659738110', '', '', 0, 0, 1, '2026-05-03 16:58:21', '2026-05-08 10:36:30', NULL),
(4, 'kustomer 1', '08797556756', 'demo@rekanonline.com', '', 0, 0, 1, '2026-05-04 12:17:26', '2026-05-04 12:17:31', NULL),
(5, 'Budi Santoso', '081234567890', 'budi@example.com', 'Alergi minyak lavender', 0, 0, 0, '2026-05-11 11:43:20', '2026-05-11 11:43:20', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `version` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `namespace` varchar(255) NOT NULL,
  `time` int(11) NOT NULL,
  `batch` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `version`, `class`, `group`, `namespace`, `time`, `batch`) VALUES
(14, '2026-05-03-090001', 'App\\Database\\Migrations\\CreateCategoriesTable', 'default', 'App', 1777773890, 1),
(15, '2026-05-03-090002', 'App\\Database\\Migrations\\CreateTherapistsTable', 'default', 'App', 1777773890, 1),
(16, '2026-05-03-090003', 'App\\Database\\Migrations\\CreateUsersTable', 'default', 'App', 1777773890, 1),
(17, '2026-05-03-090004', 'App\\Database\\Migrations\\CreateServicesTable', 'default', 'App', 1777773890, 1),
(18, '2026-05-03-090005', 'App\\Database\\Migrations\\CreateCustomersTable', 'default', 'App', 1777773890, 1),
(19, '2026-05-03-090006', 'App\\Database\\Migrations\\CreateBookingsTable', 'default', 'App', 1777773891, 1),
(20, '2026-05-03-090007', 'App\\Database\\Migrations\\CreateTransactionsTable', 'default', 'App', 1777773891, 1),
(21, '2026-05-03-090008', 'App\\Database\\Migrations\\CreateRatingsTable', 'default', 'App', 1777773891, 1),
(22, '2026-05-03-090009', 'App\\Database\\Migrations\\CreateTherapistSchedulesTable', 'default', 'App', 1777773891, 1),
(23, '2026-05-03-090010', 'App\\Database\\Migrations\\CreateTherapistLeavesTable', 'default', 'App', 1777773891, 1),
(24, '2026-05-03-090011', 'App\\Database\\Migrations\\CreateAuditLogsTable', 'default', 'App', 1777773891, 1),
(25, '2026-05-03-090012', 'App\\Database\\Migrations\\CreateNotificationsTable', 'default', 'App', 1777773891, 1),
(26, '2026-05-03-090013', 'App\\Database\\Migrations\\CreateCiSessionsTable', 'default', 'App', 1777773891, 1),
(27, '2026-05-03-104800', 'App\\Database\\Migrations\\AlterTransactionsBookingIdNullable', 'default', 'App', 1777780059, 2),
(28, '2026-05-03-110000', 'App\\Database\\Migrations\\CreateRoomsTable', 'default', 'App', 1777803896, 3),
(29, '2026-05-03-110001', 'App\\Database\\Migrations\\AddRoomIdToBookingsTable', 'default', 'App', 1777803896, 3),
(30, '2026-05-08-100000', 'App\\Database\\Migrations\\AddAwaitingPaymentToBookingsStatus', 'default', 'App', 1778208979, 4),
(31, '2026-05-08-110000', 'App\\Database\\Migrations\\CreateBookingServicesTable', 'default', 'App', 1778210402, 5),
(32, '2026-05-10-100000', 'App\\Database\\Migrations\\CreateSettingsTable', 'default', 'App', 1778383132, 6),
(33, '2026-05-10-110000', 'App\\Database\\Migrations\\AlterBookingsEndTimeNullable', 'default', 'App', 1778387835, 7),
(34, '2026-05-10-120000', 'App\\Database\\Migrations\\AddTaxToSettingsAndTransactions', 'default', 'App', 1778388603, 8);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `type` enum('booking','schedule','payment','system','rating') NOT NULL DEFAULT 'system',
  `reference_id` int(11) UNSIGNED DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `reference_id`, `is_read`, `created_at`) VALUES
(31, 2, 'Booking Baru', 'Booking baru BK-20260508-001 dari agus safri pada 2026-05-08.', 'booking', 15, 1, NULL),
(32, 3, 'Booking Baru', 'Booking baru BK-20260508-001 dari agus safri pada 2026-05-08.', 'booking', 15, 1, NULL),
(33, 3, 'Check In Booking', 'Booking BK-20260508-001 sudah check in. Silakan mulai treatment.', 'booking', 15, 1, NULL),
(34, 3, 'Check In Booking', 'Booking BK-20260508-001 sudah check in. Silakan mulai treatment.', 'booking', 15, 1, NULL),
(35, 2, 'Booking Baru', 'Booking baru BK-20260509-001 dari agus safri pada 2026-05-09.', 'booking', 16, 1, NULL),
(36, 3, 'Booking Baru', 'Booking baru BK-20260509-001 dari agus safri pada 2026-05-09.', 'booking', 16, 1, NULL),
(37, 3, 'Check In Booking', 'Booking BK-20260509-001 sudah check in. Silakan mulai treatment.', 'booking', 16, 1, NULL),
(38, 2, 'Booking Baru', 'Booking baru BK-20260510-001 dari agus safri pada 2026-05-10.', 'booking', 17, 1, NULL),
(39, 3, 'Booking Baru', 'Booking baru BK-20260510-001 dari agus safri pada 2026-05-10.', 'booking', 17, 1, NULL),
(40, 3, 'Check In Booking', 'Booking BK-20260510-001 sudah check in. Silakan mulai treatment.', 'booking', 17, 1, NULL),
(41, 2, 'Booking Baru', 'Booking baru BK-20260510-002 dari Ani Wijaya pada 2026-05-10.', 'booking', 18, 1, NULL),
(42, 3, 'Booking Baru', 'Booking baru BK-20260510-002 dari Ani Wijaya pada 2026-05-10.', 'booking', 18, 1, NULL),
(43, 2, 'Booking Baru', 'Booking baru BK-20260510-003 dari Ani Wijaya pada 2026-05-10.', 'booking', 19, 1, NULL),
(44, 3, 'Booking Baru', 'Booking baru BK-20260510-003 dari Ani Wijaya pada 2026-05-10.', 'booking', 19, 1, NULL),
(45, 3, 'Check In Booking', 'Booking BK-20260510-003 sudah check in. Silakan mulai treatment.', 'booking', 19, 1, NULL),
(46, 4, 'Akun Dibuat', 'Akun Anda telah dibuat. Silakan login menggunakan kredensial yang diberikan.', 'system', 2, 0, NULL),
(47, 5, 'Akun Dibuat', 'Akun Anda telah dibuat. Silakan login menggunakan kredensial yang diberikan.', 'system', 3, 0, NULL),
(48, 6, 'Akun Dibuat', 'Akun Anda telah dibuat. Silakan login menggunakan kredensial yang diberikan.', 'system', 4, 0, NULL),
(49, 7, 'Akun Dibuat', 'Akun Anda telah dibuat. Silakan login menggunakan kredensial yang diberikan.', 'system', 5, 0, NULL),
(50, 8, 'Akun Dibuat', 'Akun Anda telah dibuat. Silakan login menggunakan kredensial yang diberikan.', 'system', 6, 0, NULL),
(51, 9, 'Akun Dibuat', 'Akun Anda telah dibuat. Silakan login menggunakan kredensial yang diberikan.', 'system', 7, 0, NULL),
(52, 2, 'Booking Baru', 'Booking baru BK-20260511-0001 dari kustomer 1 pada 2026-05-11.', 'booking', 20, 0, NULL),
(53, 3, 'Booking Baru', 'Booking baru BK-20260511-0001 dari kustomer 1 pada 2026-05-11.', 'booking', 20, 0, NULL),
(54, 2, 'Booking Baru', 'Booking baru BK-20260511-0002 dari kustomer 1 pada 2026-05-11.', 'booking', 21, 0, NULL),
(55, 3, 'Booking Baru', 'Booking baru BK-20260511-0002 dari kustomer 1 pada 2026-05-11.', 'booking', 21, 0, NULL),
(56, 10, 'Akun Dibuat', 'Akun Anda telah dibuat. Silakan login menggunakan kredensial yang diberikan.', 'system', 8, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) UNSIGNED NOT NULL,
  `booking_id` int(11) UNSIGNED NOT NULL,
  `customer_id` int(11) UNSIGNED NOT NULL,
  `therapist_id` int(11) UNSIGNED NOT NULL,
  `rating` tinyint(1) UNSIGNED NOT NULL,
  `comment` text DEFAULT NULL,
  `rated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Ruang 1', 'active', '2026-05-03 17:25:12', '2026-05-03 17:25:12', NULL),
(2, 'Ruang 2', 'active', '2026-05-03 17:25:12', '2026-05-03 17:25:12', NULL),
(3, 'Ruang VIP', 'active', '2026-05-03 17:25:12', '2026-05-04 11:47:28', NULL),
(4, 'Ruang Facial', 'active', '2026-05-03 17:25:12', '2026-05-03 17:25:12', NULL),
(5, 'Ruang Edited Test', 'inactive', '2026-05-04 11:27:17', '2026-05-04 11:46:47', '2026-05-04 11:46:47'),
(6, 'Ruang Test Baru', 'active', '2026-05-04 11:28:26', '2026-05-04 11:29:29', '2026-05-04 11:29:29'),
(7, 'Ruang 3', 'active', '2026-05-12 08:20:03', '2026-05-12 08:20:11', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `category_id` int(11) UNSIGNED NOT NULL,
  `description` text DEFAULT NULL,
  `duration_minutes` int(11) UNSIGNED NOT NULL DEFAULT 60,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `category_id`, `description`, `duration_minutes`, `price`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Pijat Relaksasi 60 min', 1, 'Pijat tubuh full relaksasi 60 menit', 60, 150000.00, 1, '2026-05-03 09:07:11', '2026-05-03 09:07:11', NULL),
(2, 'Pijat Relaksasi 90 min', 1, 'Pijat tubuh full relaksasi 90 menit', 90, 200000.00, 1, '2026-05-03 09:07:11', '2026-05-03 09:07:11', NULL),
(3, 'Reflexology 45 min', 2, 'Pijat refleksi kaki 45 menit', 45, 100000.00, 1, '2026-05-03 09:07:11', '2026-05-03 09:07:11', NULL),
(4, 'Pijat Leher 30 min', 2, 'Pijat leher dan bahu 30 menit', 30, 75000.00, 1, '2026-05-03 09:07:11', '2026-05-03 09:07:11', NULL),
(5, 'Facial Treatment', 3, 'Perawatan wajah 60 menit', 60, 180000.00, 1, '2026-05-03 09:07:11', '2026-05-03 09:07:11', NULL),
(6, 'Body Scrub', 3, 'Lulur tubuh 60 menit', 60, 165000.00, 1, '2026-05-03 09:07:11', '2026-05-03 09:07:11', NULL),
(7, 'relaksasi', 6, 'deskripsi layanan', 50, 200000.00, 1, '2026-05-12 08:18:31', '2026-05-12 08:37:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) UNSIGNED NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'recaptcha_enabled', '0', '2026-05-10 10:18:52', '2026-05-11 09:29:58'),
(2, 'recaptcha_site_key', '6LfxP_srAAAAAHmCORsouSFUKgw1QSq7boYbsJ01', '2026-05-10 10:18:52', '2026-05-11 09:29:58'),
(3, 'recaptcha_secret_key', '6LfxP_srAAAAAIKgOUh9bFh6QTG-qCS96nnqIqnZ', '2026-05-10 10:18:52', '2026-05-11 09:29:58'),
(4, 'tax_enabled', '1', '2026-05-10 11:50:03', '2026-05-11 09:29:58'),
(5, 'tax_rate', '11', '2026-05-10 11:50:03', '2026-05-11 09:29:58'),
(6, 'tax_label', 'Pajak', '2026-05-10 11:50:03', '2026-05-11 09:29:58'),
(7, 'default_commission_rate', '10', '2026-05-11 08:33:52', '2026-05-11 09:29:58');

-- --------------------------------------------------------

--
-- Table structure for table `therapists`
--

CREATE TABLE `therapists` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `specialty` varchar(200) DEFAULT NULL,
  `commission_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `status` enum('active','inactive','on_leave') NOT NULL DEFAULT 'active',
  `avatar_path` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `therapists`
--

INSERT INTO `therapists` (`id`, `name`, `phone`, `specialty`, `commission_rate`, `status`, `avatar_path`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Sari Dewi', '081234567890', 'Pijat Relaksasi, Reflexology', 35.00, 'active', NULL, '', NULL, '2026-05-11 09:03:50', NULL),
(8, 'dewi ari', '081234567890', 'Pijat Relaksasi, Reflexology', 15.00, 'active', NULL, 'deskripsi terapis', '2026-05-12 08:19:48', '2026-05-12 08:19:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `therapist_leaves`
--

CREATE TABLE `therapist_leaves` (
  `id` int(11) UNSIGNED NOT NULL,
  `therapist_id` int(11) UNSIGNED NOT NULL,
  `leave_date` date NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_by` int(11) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `therapist_schedules`
--

CREATE TABLE `therapist_schedules` (
  `id` int(11) UNSIGNED NOT NULL,
  `therapist_id` int(11) UNSIGNED NOT NULL,
  `day_of_week` tinyint(1) UNSIGNED NOT NULL COMMENT '0=Sunday, 1=Monday...6=Saturday',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `therapist_schedules`
--

INSERT INTO `therapist_schedules` (`id`, `therapist_id`, `day_of_week`, `start_time`, `end_time`, `is_available`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '09:00:00', '17:00:00', 1, NULL, NULL),
(2, 1, 2, '09:00:00', '17:00:00', 1, NULL, NULL),
(3, 1, 3, '09:00:00', '17:00:00', 1, NULL, NULL),
(4, 1, 4, '09:00:00', '17:00:00', 1, NULL, NULL),
(5, 1, 5, '09:00:00', '17:00:00', 1, NULL, NULL),
(6, 1, 6, '09:00:00', '17:00:00', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) UNSIGNED NOT NULL,
  `transaction_code` varchar(20) NOT NULL,
  `booking_id` int(11) UNSIGNED DEFAULT NULL,
  `customer_id` int(11) UNSIGNED NOT NULL,
  `staff_id` int(11) UNSIGNED NOT NULL,
  `therapist_id` int(11) UNSIGNED DEFAULT NULL,
  `service_id` int(11) UNSIGNED NOT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(12,2) DEFAULT NULL,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment_method` enum('cash','transfer','qris','card','other') NOT NULL DEFAULT 'cash',
  `payment_status` enum('paid','unpaid','refunded') NOT NULL DEFAULT 'unpaid',
  `commission_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net_revenue` decimal(12,2) NOT NULL DEFAULT 0.00,
  `paid_at` datetime DEFAULT NULL,
  `created_by` int(11) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `transaction_code`, `booking_id`, `customer_id`, `staff_id`, `therapist_id`, `service_id`, `subtotal`, `discount`, `tax_amount`, `total_amount`, `payment_method`, `payment_status`, `commission_amount`, `net_revenue`, `paid_at`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 'TX-20260508-001', 15, 3, 2, 1, 6, 165000.00, 50000.00, 0.00, 115000.00, 'cash', 'paid', 34500.00, 80500.00, '2026-05-08 11:27:33', 2, '2026-05-08 11:27:33', '2026-05-08 11:27:33', NULL),
(3, 'TX-20260509-001', 16, 3, 2, 1, 5, 180000.00, 0.00, 0.00, 180000.00, 'cash', 'paid', 54000.00, 126000.00, '2026-05-09 11:07:39', 2, '2026-05-09 11:07:39', '2026-05-09 11:07:39', NULL),
(4, 'TX-20260510-001', 17, 3, 2, 1, 6, 165000.00, 0.00, 0.00, 165000.00, 'cash', 'paid', 49500.00, 115500.00, '2026-05-10 11:39:45', 2, '2026-05-10 11:39:45', '2026-05-10 11:39:45', NULL),
(5, 'TX-20260510-002', 19, 2, 2, 1, 5, 180000.00, 0.00, 19800.00, 199800.00, 'cash', 'paid', 54000.00, 126000.00, '2026-05-10 12:05:46', 2, '2026-05-10 12:05:46', '2026-05-10 12:05:46', NULL),
(6, 'TX-20260511-0001', 20, 4, 2, 1, 4, 75000.00, 0.00, 8250.00, 83250.00, 'cash', 'paid', 26250.00, 48750.00, '2026-05-11 11:46:43', 2, '2026-05-11 11:46:43', '2026-05-11 11:46:43', NULL),
(7, 'TX-20260511-0002', 21, 4, 2, 1, 3, 100000.00, 0.00, 11000.00, 111000.00, 'cash', 'paid', 35000.00, 65000.00, '2026-05-11 11:56:47', 2, '2026-05-11 11:56:47', '2026-05-11 11:56:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('owner','staff','therapist') NOT NULL DEFAULT 'staff',
  `therapist_id` int(11) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `role`, `therapist_id`, `is_active`, `last_login`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'owner', 'owner@spa.com', '$2y$10$iIDkdg3U5YJvA0ROwsh3SOYcnqhPUYYahfCEpZ9/XmiWct61sWJDi', 'Spa Owner', 'owner', NULL, 1, '2026-05-12 08:17:30', '2026-05-03 09:07:11', '2026-05-12 08:17:30', NULL),
(2, 'staff', 'staff@spa.com', '$2y$10$pMo7X3VcMu/.vtto6JV4/.2WFItuxbGEfuIA/JGkq1588kOmRBruq', 'Staff Resepsionis', 'staff', NULL, 1, '2026-05-11 11:56:47', '2026-05-03 09:07:11', '2026-05-11 11:56:47', NULL),
(3, 'sari', 'sari@spa.com', '$2y$10$N3I5BjFD2Bh6LyADWWAp1evplAUXaJJ6pyDxK1.e.y.i3yPu7gkm.', 'Sari Dewi', 'therapist', 1, 1, '2026-05-11 11:56:31', '2026-05-03 09:07:11', '2026-05-11 11:56:31', NULL),
(4, 'rinasari', 'rina@test.com', '$2y$10$p2xzog7gCNENJyLDtUWq2ukmoE6t2BU/kq38gQCgrVjqJyT6olwQW', 'Rina Sari', 'therapist', NULL, 1, NULL, '2026-05-11 08:59:49', '2026-05-11 12:22:22', '2026-05-11 12:22:22'),
(5, 'testerror123', 'testerror@test.com', '$2y$10$TbLVqZiLIUDksL.deTXZh./Ze1xhMIcNYiUIGY8uZViA5i.Drk76m', 'Test Error', 'therapist', NULL, 1, NULL, '2026-05-11 09:00:31', '2026-05-11 12:22:20', '2026-05-11 12:22:20'),
(6, 'mayaputri', 'maya@test.com', '$2y$10$Lq6P5QoDssKMeymjF1YX5OyDzQCl10roWGLc.5r9pXCpQZIdE6Nve', 'Maya Putri', 'therapist', NULL, 1, NULL, '2026-05-11 09:06:51', '2026-05-11 12:22:18', '2026-05-11 12:22:18'),
(7, 'dewilestari', 'dewi@test.com', '$2y$10$kDtSYtyhByafgBhPitN6ouBCWx.o0miSpj7kNXUGqWheagJ4xX7MC', 'Dewi Lestari', 'therapist', NULL, 1, NULL, '2026-05-11 09:16:59', '2026-05-11 12:22:16', '2026-05-11 12:22:16'),
(8, 'abc', 'admin@asrama.com', '$2y$10$4n27VTWPp8Yz5nUGcBNc3unRh12Ti6z.3m3kl97wRG0M8YxxgQpq6', 'abc', 'therapist', NULL, 1, NULL, '2026-05-11 09:29:40', '2026-05-11 12:22:01', '2026-05-11 12:22:01'),
(9, 'abcd', 'demo@rekanonline.com', '$2y$10$3eASVqOZ9cLske89VAYEYeVzrK1GZqfxjuMXaOo.HRAOzRYTJdUTO', 'abc', 'therapist', NULL, 1, NULL, '2026-05-11 09:30:28', '2026-05-11 12:21:59', '2026-05-11 12:21:59'),
(10, 'dewi', 'demo@rekanonline1.com', '$2y$10$DFurdOtNRieFy22Om3evjux.IBM2h5ZiBi.JfQUR78voP2ohUU7Zu', 'dewi ari', 'therapist', 8, 1, NULL, '2026-05-12 08:19:48', '2026-05-12 08:19:48', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `action` (`action`),
  ADD KEY `table_name` (`table_name`),
  ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_code` (`booking_code`),
  ADD KEY `bookings_created_by_foreign` (`created_by`),
  ADD KEY `bookings_updated_by_foreign` (`updated_by`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `therapist_id` (`therapist_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `status` (`status`),
  ADD KEY `booking_date` (`booking_date`),
  ADD KEY `source` (`source`);

--
-- Indexes for table `booking_services`
--
ALTER TABLE `booking_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_services_service_id_foreign` (`service_id`),
  ADD KEY `booking_id_service_id` (`booking_id`,`service_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `ci_sessions`
--
ALTER TABLE `ci_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `timestamp` (`timestamp`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `phone` (`phone`),
  ADD KEY `name` (`name`),
  ADD KEY `is_member` (`is_member`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `is_read` (`is_read`),
  ADD KEY `type` (`type`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_id` (`booking_id`),
  ADD KEY `ratings_customer_id_foreign` (`customer_id`),
  ADD KEY `therapist_id` (`therapist_id`),
  ADD KEY `rating` (`rating`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `is_active` (`is_active`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`);

--
-- Indexes for table `therapists`
--
ALTER TABLE `therapists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status` (`status`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `therapist_leaves`
--
ALTER TABLE `therapist_leaves`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `therapist_id_leave_date` (`therapist_id`,`leave_date`),
  ADD KEY `therapist_leaves_created_by_foreign` (`created_by`),
  ADD KEY `therapist_id` (`therapist_id`),
  ADD KEY `leave_date` (`leave_date`);

--
-- Indexes for table `therapist_schedules`
--
ALTER TABLE `therapist_schedules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `therapist_id_day_of_week` (`therapist_id`,`day_of_week`),
  ADD KEY `therapist_id` (`therapist_id`),
  ADD KEY `day_of_week` (`day_of_week`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_code` (`transaction_code`),
  ADD KEY `transactions_service_id_foreign` (`service_id`),
  ADD KEY `transactions_created_by_foreign` (`created_by`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `therapist_id` (`therapist_id`),
  ADD KEY `payment_status` (`payment_status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `users_therapist_id_foreign` (`therapist_id`),
  ADD KEY `role` (`role`),
  ADD KEY `is_active` (`is_active`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=302;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `booking_services`
--
ALTER TABLE `booking_services`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `therapists`
--
ALTER TABLE `therapists`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `therapist_leaves`
--
ALTER TABLE `therapist_leaves`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `therapist_schedules`
--
ALTER TABLE `therapist_schedules`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `bookings_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  ADD CONSTRAINT `bookings_therapist_id_foreign` FOREIGN KEY (`therapist_id`) REFERENCES `therapists` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `bookings_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `booking_services`
--
ALTER TABLE `booking_services`
  ADD CONSTRAINT `booking_services_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `booking_services_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `ratings_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `ratings_therapist_id_foreign` FOREIGN KEY (`therapist_id`) REFERENCES `therapists` (`id`);

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `therapist_leaves`
--
ALTER TABLE `therapist_leaves`
  ADD CONSTRAINT `therapist_leaves_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `therapist_leaves_therapist_id_foreign` FOREIGN KEY (`therapist_id`) REFERENCES `therapists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `therapist_schedules`
--
ALTER TABLE `therapist_schedules`
  ADD CONSTRAINT `therapist_schedules_therapist_id_foreign` FOREIGN KEY (`therapist_id`) REFERENCES `therapists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `transactions_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  ADD CONSTRAINT `transactions_staff_id_foreign` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_therapist_id_foreign` FOREIGN KEY (`therapist_id`) REFERENCES `therapists` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_therapist_id_foreign` FOREIGN KEY (`therapist_id`) REFERENCES `therapists` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
