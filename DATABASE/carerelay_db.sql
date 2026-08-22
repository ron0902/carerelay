-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 20, 2026 at 06:33 PM
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
-- Database: `carerelay_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `caregiver_id` int(11) NOT NULL,
  `organization_id` int(11) DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `duration` int(11) DEFAULT 60 COMMENT 'Duration in minutes',
  `appointment_type` enum('Home Visit','Clinic Visit','Virtual Consultation','Home Care Visit') DEFAULT 'Home Visit',
  `reason` text NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Approved','In Progress','Completed','Cancelled','Rejected') NOT NULL DEFAULT 'Pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `caregiver_id`, `organization_id`, `appointment_date`, `appointment_time`, `duration`, `appointment_type`, `reason`, `location`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(14, 3, 4, 16, '2026-08-22', '15:04:00', 60, 'Home Visit', '23123', '21312', 'Approved', '1321321321', '2026-08-20 16:00:23', '2026-08-20 16:28:09');

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `caregiver_id` int(11) NOT NULL,
  `organization_id` int(11) DEFAULT NULL,
  `assigned_by` int(11) NOT NULL COMMENT 'Admin User ID',
  `assigned_date` date NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `shift` enum('Morning','Afternoon','Evening','Night','Flexible') DEFAULT 'Flexible',
  `status` enum('Active','Completed','Cancelled','Suspended') DEFAULT 'Active',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `patient_id`, `caregiver_id`, `organization_id`, `assigned_by`, `assigned_date`, `start_date`, `end_date`, `shift`, `status`, `remarks`, `created_at`, `updated_at`) VALUES
(3, 3, 4, 16, 1, '2026-08-17', '2026-03-13', '2026-08-28', 'Morning', 'Active', '1eqwewqewqewqe', '2026-08-17 16:35:15', '2026-08-17 16:35:15');

-- --------------------------------------------------------

--
-- Table structure for table `caregivers`
--

CREATE TABLE `caregivers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `license_number` varchar(100) DEFAULT NULL,
  `specialization` varchar(150) DEFAULT NULL,
  `experience_years` int(11) DEFAULT 0,
  `availability` enum('Available','Busy','On Leave','Offline') DEFAULT 'Available',
  `hourly_rate` decimal(10,2) DEFAULT 0.00,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `caregivers`
--

INSERT INTO `caregivers` (`id`, `user_id`, `license_number`, `specialization`, `experience_years`, `availability`, `hourly_rate`, `bio`, `created_at`, `updated_at`) VALUES
(4, 9, '213123213213', '', 0, 'Available', 45.00, '21312321', '2026-08-17 16:23:04', '2026-08-17 16:23:04');

-- --------------------------------------------------------

--
-- Table structure for table `caregiver_availability`
--

CREATE TABLE `caregiver_availability` (
  `id` int(11) NOT NULL,
  `caregiver_id` int(11) NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT 0,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `care_plans`
--

CREATE TABLE `care_plans` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `caregiver_id` int(11) NOT NULL,
  `assignment_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `diagnosis` varchar(255) DEFAULT NULL,
  `care_goal` text NOT NULL,
  `medications` text DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('Active','Completed','Cancelled') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `type` enum('Appointment','Assignment','Care Plan','System','Reminder','Password Reset') DEFAULT 'System',
  `is_read` tinyint(1) DEFAULT 0,
  `reference_id` int(11) DEFAULT NULL COMMENT 'Related record ID',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `organization_name` varchar(200) NOT NULL,
  `contact_person` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`id`, `user_id`, `organization_name`, `contact_person`, `phone`, `email`, `address`, `city`, `province`, `postal_code`, `description`, `website`, `status`, `created_at`, `updated_at`) VALUES
(16, 1, 'rontzy09213', '3213213', '21321321', '3213213213', '21321321', '', '', '', '3421341e213423', '', 'Active', '2026-08-17 16:34:43', '2026-08-17 16:34:51');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `otp` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `blood_type` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') DEFAULT NULL,
  `address` text DEFAULT NULL,
  `emergency_contact_name` varchar(150) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `medical_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `user_id`, `date_of_birth`, `gender`, `blood_type`, `address`, `emergency_contact_name`, `emergency_contact_phone`, `medical_notes`, `created_at`, `updated_at`) VALUES
(3, 6, '2001-09-02', 'Male', 'O+', 'gensan', 'shanti dope', '12312321312321', 'adasdasdsadasdsad', '2026-08-12 15:35:14', '2026-08-12 15:35:14');

-- --------------------------------------------------------

--
-- Table structure for table `shift_offers`
--

CREATE TABLE `shift_offers` (
  `id` int(11) NOT NULL,
  `assignment_id` int(11) NOT NULL,
  `caregiver_id` int(11) NOT NULL,
  `offered_by` int(11) NOT NULL,
  `status` enum('Pending','Accepted','Declined') NOT NULL DEFAULT 'Pending',
  `offered_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `responded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shift_offers`
--

INSERT INTO `shift_offers` (`id`, `assignment_id`, `caregiver_id`, `offered_by`, `status`, `offered_at`, `responded_at`, `created_at`, `updated_at`) VALUES
(1, 3, 4, 1, 'Accepted', '2026-08-20 14:28:06', '2026-08-20 14:50:03', '2026-08-20 14:28:06', '2026-08-20 14:50:03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Caregiver','Patient','Organization') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `phone`, `profile_picture`, `status`, `created_at`, `updated_at`) VALUES
(1, '3213213', '', 'admin@carerelay.com', '$2y$10$cB3QsxlVwXsj1ysHJwDVfORaA9uXr6GiPjNblmVsx1ZtOv6CQS2eK', 'Admin', '21321321', NULL, 'Active', '2026-08-11 14:47:15', '2026-08-18 15:31:28'),
(6, 'ron', 'saladero', 'ronoliver092@gmail.com', '$2y$10$qz9ezuLTGf6NzfFiVYmR3.gE4AQHEpORozKI9q5nUL6bQCZPmPpQa', 'Patient', '321312312312', NULL, 'Active', '2026-08-12 15:35:14', '2026-08-12 15:35:14'),
(7, 'ramon', '', 'ramon@gmail.com', '$2y$10$QN.OBPPgYmoQjohFkb4S/.KNl3GLgfFsG5rhAxhO.IfC3V.ylp5YC', 'Caregiver', '12312312312312', NULL, 'Inactive', '2026-08-12 15:35:54', '2026-08-17 16:22:24'),
(8, 'ron', '', 'ron@gmail.com', '$2y$10$0cQCG86DC/5YVDI8TopuReCwRmG6iQusP7hvkEyqnA5nm.787ExZK', 'Caregiver', '0992323', NULL, 'Inactive', '2026-08-17 14:50:46', '2026-08-17 16:22:22'),
(9, 'ron', 'saladero', 'rontzy0902@gmail.com', '$2y$10$NU8JbAtaVo5E9CSIg0wrHucz3RGSoKbmsgAH.JKoacjd87d/BccSC', 'Caregiver', '09321321321', NULL, 'Active', '2026-08-17 16:23:04', '2026-08-19 14:37:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_appointment_patient` (`patient_id`),
  ADD KEY `fk_appointment_caregiver` (`caregiver_id`),
  ADD KEY `fk_appointment_organization` (`organization_id`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_assignment_patient` (`patient_id`),
  ADD KEY `fk_assignment_caregiver` (`caregiver_id`),
  ADD KEY `fk_assignment_organization` (`organization_id`),
  ADD KEY `fk_assignment_admin` (`assigned_by`);

--
-- Indexes for table `caregivers`
--
ALTER TABLE `caregivers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `license_number` (`license_number`),
  ADD KEY `fk_caregiver_user` (`user_id`);

--
-- Indexes for table `caregiver_availability`
--
ALTER TABLE `caregiver_availability`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_caregiver_day` (`caregiver_id`,`day_of_week`);

--
-- Indexes for table `care_plans`
--
ALTER TABLE `care_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_careplan_patient` (`patient_id`),
  ADD KEY `fk_careplan_caregiver` (`caregiver_id`),
  ADD KEY `fk_careplan_assignment` (`assignment_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_notification_user` (`user_id`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_organization_user` (`user_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_passwordreset_user` (`user_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_patient_user` (`user_id`);

--
-- Indexes for table `shift_offers`
--
ALTER TABLE `shift_offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_shift_offer_assignment` (`assignment_id`),
  ADD KEY `fk_shift_offer_caregiver` (`caregiver_id`),
  ADD KEY `fk_shift_offer_offered_by` (`offered_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `caregivers`
--
ALTER TABLE `caregivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `caregiver_availability`
--
ALTER TABLE `caregiver_availability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `care_plans`
--
ALTER TABLE `care_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `shift_offers`
--
ALTER TABLE `shift_offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `fk_appointment_caregiver` FOREIGN KEY (`caregiver_id`) REFERENCES `caregivers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_appointment_organization` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_appointment_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `fk_assignment_admin` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assignment_caregiver` FOREIGN KEY (`caregiver_id`) REFERENCES `caregivers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assignment_organization` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assignment_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `caregivers`
--
ALTER TABLE `caregivers`
  ADD CONSTRAINT `fk_caregiver_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `caregiver_availability`
--
ALTER TABLE `caregiver_availability`
  ADD CONSTRAINT `fk_availability_caregiver` FOREIGN KEY (`caregiver_id`) REFERENCES `caregivers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `care_plans`
--
ALTER TABLE `care_plans`
  ADD CONSTRAINT `fk_careplan_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_careplan_caregiver` FOREIGN KEY (`caregiver_id`) REFERENCES `caregivers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_careplan_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `organizations`
--
ALTER TABLE `organizations`
  ADD CONSTRAINT `fk_organization_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `fk_passwordreset_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `fk_patient_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shift_offers`
--
ALTER TABLE `shift_offers`
  ADD CONSTRAINT `fk_shift_offer_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_shift_offer_caregiver` FOREIGN KEY (`caregiver_id`) REFERENCES `caregivers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_shift_offer_offered_by` FOREIGN KEY (`offered_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
