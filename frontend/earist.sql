-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 07, 2026 at 10:26 AM
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
-- Database: `earist`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_year`
--

CREATE TABLE `academic_year` (
  `id` int(11) NOT NULL,
  `description` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `academic_year`
--

INSERT INTO `academic_year` (`id`, `description`) VALUES
(1, '11');

-- --------------------------------------------------------

--
-- Table structure for table `active_academic_year`
--

CREATE TABLE `active_academic_year` (
  `id` int(11) NOT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  `term_id` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `children_table`
--

CREATE TABLE `children_table` (
  `id` int(11) NOT NULL,
  `childrenFirstName` varchar(255) NOT NULL,
  `childrenMiddleName` varchar(255) DEFAULT NULL,
  `childrenLastName` varchar(255) NOT NULL,
  `childrenNameExtension` varchar(50) DEFAULT NULL,
  `dateOfBirth` date NOT NULL,
  `person_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `children_table`
--

INSERT INTO `children_table` (`id`, `childrenFirstName`, `childrenMiddleName`, `childrenLastName`, `childrenNameExtension`, `dateOfBirth`, `person_id`, `createdAt`) VALUES
(9, 'Shrock', 'ajidsnas', 'asojkdnsa', 'asidn', '2001-11-11', 123123, '2026-02-07 09:07:54');

-- --------------------------------------------------------

--
-- Table structure for table `citizenship_table`
--

CREATE TABLE `citizenship_table` (
  `id` int(11) NOT NULL,
  `citizenship_description` varchar(100) DEFAULT NULL,
  `citizenshipType` varchar(50) DEFAULT NULL,
  `countryName` varchar(100) DEFAULT NULL,
  `person_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `college_table`
--

CREATE TABLE `college_table` (
  `id` int(20) UNSIGNED NOT NULL,
  `collegeNameOfSchool` varchar(255) DEFAULT NULL,
  `collegeDegree` varchar(255) DEFAULT NULL,
  `collegePeriodFrom` year(4) DEFAULT NULL,
  `collegePeriodTo` year(4) DEFAULT NULL,
  `collegeHighestAttained` varchar(255) DEFAULT NULL,
  `collegeYearGraduated` year(4) DEFAULT NULL,
  `collegeScholarshipAcademicHonorsReceived` text DEFAULT NULL,
  `person_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `college_table`
--

INSERT INTO `college_table` (`id`, `collegeNameOfSchool`, `collegeDegree`, `collegePeriodFrom`, `collegePeriodTo`, `collegeHighestAttained`, `collegeYearGraduated`, `collegeScholarshipAcademicHonorsReceived`, `person_id`) VALUES
(63, 'EARIST', 'Bachelor of Information Technology', '2022', '2026', 'College Graduate', '2026', 'Cum Laude', 3),
(64, 'ICCT', 'Bachelor of Information Technology', '2020', '2026', 'Wala', '2026', 'Wala', 2),
(65, 'asdasd', 'sadasd', '0000', '0000', '123213', '0000', 'asd', 23123);

-- --------------------------------------------------------

--
-- Table structure for table `company_settings`
--

CREATE TABLE `company_settings` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `header_color` varchar(7) DEFAULT '#ffffff',
  `footer_text` text DEFAULT NULL,
  `footer_color` varchar(7) DEFAULT '#ffffff',
  `logo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_settings`
--

INSERT INTO `company_settings` (`id`, `company_name`, `header_color`, `footer_text`, `footer_color`, `logo_url`) VALUES
(1, 'EARIST', '#b21010', 'Copyright 2025', '#b21010', '/uploads/1733197503958-pngaaa.com-2973272.png');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `department_code` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`id`, `department_name`, `department_code`, `created_at`, `updated_at`) VALUES
(18, 'fdsfsd', '12312', '2026-02-07 09:09:18', '2026-02-07 09:09:18');

-- --------------------------------------------------------

--
-- Table structure for table `department_assignment`
--

CREATE TABLE `department_assignment` (
  `id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department_assignment`
--

INSERT INTO `department_assignment` (`id`, `department_id`, `person_id`, `createdAt`) VALUES
(18, 34, 3123, '2026-02-07 09:09:25');

-- --------------------------------------------------------

--
-- Table structure for table `department_person`
--

CREATE TABLE `department_person` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `department_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department_table`
--

CREATE TABLE `department_table` (
  `id` int(11) NOT NULL,
  `department_name` varchar(100) DEFAULT NULL,
  `department_code` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `eligibility_table`
--

CREATE TABLE `eligibility_table` (
  `id` int(11) NOT NULL,
  `eligibilityName` varchar(100) DEFAULT NULL,
  `eligibilityRating` decimal(5,2) DEFAULT NULL,
  `eligibilityDateOfExam` date DEFAULT NULL,
  `eligibilityPlaceOfExam` varchar(100) DEFAULT NULL,
  `licenseNumber` varchar(50) DEFAULT NULL,
  `DateOfValidity` date DEFAULT NULL,
  `person_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eligibility_table`
--

INSERT INTO `eligibility_table` (`id`, `eligibilityName`, `eligibilityRating`, `eligibilityDateOfExam`, `eligibilityPlaceOfExam`, `licenseNumber`, `DateOfValidity`, `person_id`) VALUES
(14, 'wew', 1.10, '2025-01-06', '1', '121', '2025-01-14', NULL),
(15, 'asdasd', 0.00, '2026-02-03', 'asddas', 'asdasd', '2026-02-04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employee_table`
--

CREATE TABLE `employee_table` (
  `employee_number` int(11) NOT NULL,
  `person_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item_table`
--

CREATE TABLE `item_table` (
  `id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `item_code` varchar(50) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_table`
--

INSERT INTO `item_table` (`id`, `item_name`, `item_code`, `employee_id`, `createdAt`) VALUES
(14, 'dasd', '232', 33311, '2026-02-07 09:09:30');

-- --------------------------------------------------------

--
-- Table structure for table `learning_and_development_table`
--

CREATE TABLE `learning_and_development_table` (
  `id` int(11) NOT NULL,
  `titleOfProgram` varchar(255) DEFAULT NULL,
  `dateFrom` date DEFAULT NULL,
  `dateTo` date DEFAULT NULL,
  `numberOfHours` int(11) DEFAULT NULL,
  `typeOfLearningDevelopment` varchar(100) DEFAULT NULL,
  `conductedSponsored` varchar(100) DEFAULT NULL,
  `person_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `learning_and_development_table`
--

INSERT INTO `learning_and_development_table` (`id`, `titleOfProgram`, `dateFrom`, `dateTo`, `numberOfHours`, `typeOfLearningDevelopment`, `conductedSponsored`, `person_id`) VALUES
(1, 'sdaasd', '0000-00-00', '2020-02-02', 11, 'waeqw', '1212', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `official_time_table`
--

CREATE TABLE `official_time_table` (
  `id` int(11) NOT NULL,
  `person_id` int(11) DEFAULT NULL,
  `day` date DEFAULT NULL,
  `official_time_in` time DEFAULT NULL,
  `official_break_time_in` time DEFAULT NULL,
  `official_break_time_out` time DEFAULT NULL,
  `official_time_out` time DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `other_information_table`
--

CREATE TABLE `other_information_table` (
  `id` int(11) NOT NULL,
  `specialSkills` varchar(255) DEFAULT NULL,
  `nonAcademicDistinctions` varchar(255) DEFAULT NULL,
  `membershipInAssociation` varchar(255) DEFAULT NULL,
  `person_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `page_access`
--

CREATE TABLE `page_access` (
  `id` int(11) NOT NULL,
  `page_privilege` tinyint(1) NOT NULL,
  `page_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `page_access`
--

INSERT INTO `page_access` (`id`, `page_privilege`, `page_id`, `user_id`) VALUES
(16, 1, 6, 8),
(17, 0, 6, 14),
(18, 0, 6, 9),
(19, 0, 6, 10),
(20, 0, 6, 12),
(21, 0, 6, 13),
(22, 0, 6, 15),
(23, 0, 6, 11),
(24, 0, 6, 16),
(25, 1, 7, 8),
(26, 1, 10, 8),
(27, 1, 11, 8),
(28, 1, 12, 8),
(29, 1, 13, 8),
(30, 1, 14, 8),
(31, 1, 16, 8),
(32, 1, 17, 8),
(33, 1, 15, 8),
(34, 1, 22, 8),
(35, 1, 21, 8),
(36, 1, 20, 8),
(37, 1, 19, 8),
(38, 1, 18, 8);

-- --------------------------------------------------------

--
-- Table structure for table `page_table`
--

CREATE TABLE `page_table` (
  `id` int(11) NOT NULL,
  `page_description` varchar(255) NOT NULL,
  `page_group` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `page_table`
--

INSERT INTO `page_table` (`id`, `page_description`, `page_group`, `created_at`) VALUES
(6, 'Page Table', 'superadmin', '2025-01-09 05:09:37'),
(7, 'Children', 'superadmin', '2025-01-09 18:09:07'),
(10, 'Eligiblity', 'superadmin', '2025-01-09 18:36:43'),
(11, 'College', 'superadmin', '2025-01-09 18:36:57'),
(12, 'Department', 'superadmin', '2025-01-09 18:37:08'),
(13, 'Department Assignment', 'superadmin', '2025-01-09 18:37:23'),
(14, 'Department Items', 'superadmin', '2025-01-09 18:37:41'),
(15, 'Voluntary Works', 'sub admin', '2025-01-09 18:37:52'),
(16, 'Vocational Data', 'superadmin', '2025-01-09 18:41:34'),
(17, 'Settings', 'sub admin', '2025-01-09 18:49:11');

-- --------------------------------------------------------

--
-- Table structure for table `person_table`
--

CREATE TABLE `person_table` (
  `id` int(11) NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `middleName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `civilStatus` varchar(20) DEFAULT NULL,
  `heightM` decimal(3,2) DEFAULT NULL,
  `weightKg` decimal(5,2) DEFAULT NULL,
  `bloodType` varchar(3) DEFAULT NULL,
  `gsisNum` varchar(20) DEFAULT NULL,
  `pagibigNum` varchar(20) DEFAULT NULL,
  `philhealthNum` varchar(20) DEFAULT NULL,
  `sssNum` varchar(20) DEFAULT NULL,
  `tinNum` varchar(20) DEFAULT NULL,
  `agencyEmployeeNum` varchar(20) DEFAULT NULL,
  `houseBlockLotNum` varchar(50) DEFAULT NULL,
  `streetName` varchar(100) DEFAULT NULL,
  `subdivisionOrVillage` varchar(100) DEFAULT NULL,
  `barangayName` varchar(100) DEFAULT NULL,
  `cityOrMunicipality` varchar(100) DEFAULT NULL,
  `provinceName` varchar(100) DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `telephone` varchar(15) DEFAULT NULL,
  `mobileNum` varchar(15) DEFAULT NULL,
  `emailAddress` varchar(100) DEFAULT NULL,
  `spouseFirstName` varchar(50) DEFAULT NULL,
  `spouseMiddleName` varchar(50) DEFAULT NULL,
  `spouseLastName` varchar(50) DEFAULT NULL,
  `spouseNameExtension` varchar(10) DEFAULT NULL,
  `spouseOccupation` varchar(100) DEFAULT NULL,
  `spouseEmployerBusinessName` varchar(100) DEFAULT NULL,
  `spouseBusinessAddress` varchar(255) DEFAULT NULL,
  `spouseTelephone` varchar(15) DEFAULT NULL,
  `fatherFirstName` varchar(50) DEFAULT NULL,
  `fatherMiddleName` varchar(50) DEFAULT NULL,
  `fatherLastName` varchar(50) DEFAULT NULL,
  `fatherNameExtension` varchar(10) DEFAULT NULL,
  `motherMaidenFirstName` varchar(50) DEFAULT NULL,
  `motherMaidenMiddleName` varchar(50) DEFAULT NULL,
  `motherMaidenLastName` varchar(50) DEFAULT NULL,
  `elementaryNameOfSchool` varchar(100) DEFAULT NULL,
  `elementaryDegree` varchar(100) DEFAULT NULL,
  `elementaryPeriodFrom` year(4) DEFAULT NULL,
  `elementaryPeriodTo` year(4) DEFAULT NULL,
  `elementaryHighestAttained` varchar(100) DEFAULT NULL,
  `elementaryYearGraduated` year(4) DEFAULT NULL,
  `elementaryScholarshipAcademicHonorsReceived` varchar(255) DEFAULT NULL,
  `secondaryNameOfSchool` varchar(100) DEFAULT NULL,
  `secondaryDegree` varchar(100) DEFAULT NULL,
  `secondaryPeriodFrom` year(4) DEFAULT NULL,
  `secondaryPeriodTo` year(4) DEFAULT NULL,
  `secondaryHighestAttained` varchar(100) DEFAULT NULL,
  `secondaryYearGraduated` year(4) DEFAULT NULL,
  `secondaryScholarshipAcademicHonorsReceived` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `term_table`
--

CREATE TABLE `term_table` (
  `id` int(11) NOT NULL,
  `term_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `term_table`
--

INSERT INTO `term_table` (`id`, `term_name`) VALUES
(1, '11');

-- --------------------------------------------------------

--
-- Table structure for table `users_table`
--

CREATE TABLE `users_table` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_table`
--

INSERT INTO `users_table` (`id`, `username`, `email`, `password`) VALUES
(18, 'admin', 'admin@gmail.com', '$2b$10$eNDlp6gXr6TBK6T3AMF4ie96MpEwKZ1.miZltZbJQ9UqlMm6guvcm');

-- --------------------------------------------------------

--
-- Table structure for table `vocational_table`
--

CREATE TABLE `vocational_table` (
  `id` int(11) NOT NULL,
  `vocationalNameOfSchool` varchar(100) DEFAULT NULL,
  `vocationalDegree` varchar(100) DEFAULT NULL,
  `vocationalPeriodFrom` year(4) DEFAULT NULL,
  `vocationalPeriodTo` year(4) DEFAULT NULL,
  `vocationalHighestAttained` varchar(100) DEFAULT NULL,
  `vocationalYearGraduated` year(4) DEFAULT NULL,
  `person_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vocational_table`
--

INSERT INTO `vocational_table` (`id`, `vocationalNameOfSchool`, `vocationalDegree`, `vocationalPeriodFrom`, `vocationalPeriodTo`, `vocationalHighestAttained`, `vocationalYearGraduated`, `person_id`) VALUES
(19, 'asdasd qwe', 'qweqwe', '2003', '2006', '1', '2001', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `voluntary_work_table`
--

CREATE TABLE `voluntary_work_table` (
  `id` int(11) NOT NULL,
  `nameAndAddress` varchar(255) NOT NULL,
  `dateFrom` date NOT NULL,
  `dateTo` date NOT NULL,
  `numberOfHours` int(11) NOT NULL,
  `numberOfWorks` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `voluntary_work_table`
--

INSERT INTO `voluntary_work_table` (`id`, `nameAndAddress`, `dateFrom`, `dateTo`, `numberOfHours`, `numberOfWorks`, `createdAt`) VALUES
(10, 'Dummy - Dummy', '2025-01-01', '2025-01-14', 11, 1, '2025-01-14 20:01:57'),
(11, 'waeeaw - eqwewqeqw qw eqwe ', '2026-02-06', '2026-02-18', 11, 11, '2026-02-07 09:09:40');

-- --------------------------------------------------------

--
-- Table structure for table `work_experience_table`
--

CREATE TABLE `work_experience_table` (
  `id` int(11) NOT NULL,
  `workDateFrom` date NOT NULL,
  `workDateTo` date NOT NULL,
  `workPositionTitle` varchar(255) NOT NULL,
  `workCompany` varchar(255) NOT NULL,
  `workMonthlySalary` decimal(10,2) NOT NULL,
  `salaryJobOrPayGrade` varchar(50) NOT NULL,
  `statusOfAppointment` varchar(100) NOT NULL,
  `isGovtService` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `work_experience_table`
--

INSERT INTO `work_experience_table` (`id`, `workDateFrom`, `workDateTo`, `workPositionTitle`, `workCompany`, `workMonthlySalary`, `salaryJobOrPayGrade`, `statusOfAppointment`, `isGovtService`) VALUES
(6, '1899-11-29', '1899-11-29', 'basta', 'basta', 200000.00, 'asta', 'basta', 'yes');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_year`
--
ALTER TABLE `academic_year`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `active_academic_year`
--
ALTER TABLE `active_academic_year`
  ADD PRIMARY KEY (`id`),
  ADD KEY `academic_year_id` (`academic_year_id`),
  ADD KEY `term_id` (`term_id`);

--
-- Indexes for table `children_table`
--
ALTER TABLE `children_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `citizenship_table`
--
ALTER TABLE `citizenship_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_id` (`person_id`);

--
-- Indexes for table `college_table`
--
ALTER TABLE `college_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `department_assignment`
--
ALTER TABLE `department_assignment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `department_person`
--
ALTER TABLE `department_person`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `department_table`
--
ALTER TABLE `department_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `eligibility_table`
--
ALTER TABLE `eligibility_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_id` (`person_id`);

--
-- Indexes for table `employee_table`
--
ALTER TABLE `employee_table`
  ADD PRIMARY KEY (`employee_number`),
  ADD KEY `person_id` (`person_id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_table`
--
ALTER TABLE `item_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `learning_and_development_table`
--
ALTER TABLE `learning_and_development_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_id` (`person_id`);

--
-- Indexes for table `official_time_table`
--
ALTER TABLE `official_time_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_id` (`person_id`);

--
-- Indexes for table `other_information_table`
--
ALTER TABLE `other_information_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_id` (`person_id`);

--
-- Indexes for table `page_access`
--
ALTER TABLE `page_access`
  ADD PRIMARY KEY (`id`),
  ADD KEY `page_id` (`page_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `page_table`
--
ALTER TABLE `page_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `person_table`
--
ALTER TABLE `person_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `term_table`
--
ALTER TABLE `term_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_table`
--
ALTER TABLE `users_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vocational_table`
--
ALTER TABLE `vocational_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_id` (`person_id`);

--
-- Indexes for table `voluntary_work_table`
--
ALTER TABLE `voluntary_work_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `work_experience_table`
--
ALTER TABLE `work_experience_table`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic_year`
--
ALTER TABLE `academic_year`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `active_academic_year`
--
ALTER TABLE `active_academic_year`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `children_table`
--
ALTER TABLE `children_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `citizenship_table`
--
ALTER TABLE `citizenship_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `college_table`
--
ALTER TABLE `college_table`
  MODIFY `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `company_settings`
--
ALTER TABLE `company_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `department_assignment`
--
ALTER TABLE `department_assignment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `department_person`
--
ALTER TABLE `department_person`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `department_table`
--
ALTER TABLE `department_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eligibility_table`
--
ALTER TABLE `eligibility_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `item_table`
--
ALTER TABLE `item_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `learning_and_development_table`
--
ALTER TABLE `learning_and_development_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `official_time_table`
--
ALTER TABLE `official_time_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `other_information_table`
--
ALTER TABLE `other_information_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `page_access`
--
ALTER TABLE `page_access`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `page_table`
--
ALTER TABLE `page_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `person_table`
--
ALTER TABLE `person_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `term_table`
--
ALTER TABLE `term_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users_table`
--
ALTER TABLE `users_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `vocational_table`
--
ALTER TABLE `vocational_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `voluntary_work_table`
--
ALTER TABLE `voluntary_work_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `work_experience_table`
--
ALTER TABLE `work_experience_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `active_academic_year`
--
ALTER TABLE `active_academic_year`
  ADD CONSTRAINT `active_academic_year_ibfk_1` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_year` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `active_academic_year_ibfk_2` FOREIGN KEY (`term_id`) REFERENCES `term_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `citizenship_table`
--
ALTER TABLE `citizenship_table`
  ADD CONSTRAINT `citizenship_table_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `eligibility_table`
--
ALTER TABLE `eligibility_table`
  ADD CONSTRAINT `eligibility_table_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employee_table`
--
ALTER TABLE `employee_table`
  ADD CONSTRAINT `employee_table_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `learning_and_development_table`
--
ALTER TABLE `learning_and_development_table`
  ADD CONSTRAINT `learning_and_development_table_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `official_time_table`
--
ALTER TABLE `official_time_table`
  ADD CONSTRAINT `official_time_table_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `other_information_table`
--
ALTER TABLE `other_information_table`
  ADD CONSTRAINT `other_information_table_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vocational_table`
--
ALTER TABLE `vocational_table`
  ADD CONSTRAINT `vocational_table_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
