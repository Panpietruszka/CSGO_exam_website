-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 15, 2025 at 09:00 AM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs_go`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `bronie`
--

CREATE TABLE `bronie` (
  `id_broni` int(11) NOT NULL,
  `nazwa_broni` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bronie`
--

INSERT INTO `bronie` (`id_broni`, `nazwa_broni`) VALUES
(6, 'AK-47'),
(4, 'AWP'),
(2, 'Desert Eagle'),
(1, 'Five SeveN'),
(5, 'MP9'),
(3, 'PP-Bizon');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `gracze`
--

CREATE TABLE `gracze` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `haslo` varchar(255) NOT NULL,
  `plec` enum('Male','Female') NOT NULL,
  `akceptacja_regulaminu` tinyint(1) NOT NULL,
  `newsletter` tinyint(1) NOT NULL DEFAULT 0,
  `opis_o_sobie` text NOT NULL,
  `data_rejestracji` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gracze`
--

INSERT INTO `gracze` (`id`, `username`, `haslo`, `plec`, `akceptacja_regulaminu`, `newsletter`, `opis_o_sobie`, `data_rejestracji`) VALUES
(1, 'GamerX', 'hasz_jakis', 'Male', 1, 0, 'Lubie AWP', '2025-12-13 12:12:08'),
(2, 'ProPlayer', 'hasz_inny', 'Female', 1, 0, 'Lubie Mirage i Cache', '2025-12-13 12:12:08'),
(8, 'Piort', '$2y$10$aQOM1YtRWg9jLIMo9fl.5OpQopGYAnbsIRZ24r49l8h8w9b0Y4eQq', 'Male', 1, 0, 'Sinister#44', '2025-12-14 23:48:15'),
(9, 'Piotr', '$2y$10$cDmYgp5Q4cFYfFUh3Bvt4OFQwAzgrLA083sjtVcEVeVR6Z3rCwzhu', 'Female', 1, 0, '23', '2025-12-15 06:59:36'),
(10, 'panpietruszka543', '$2y$10$wjKtO/gksHvDZ9lPow5IU.y2SYwZCajmSb.cMVoaRYL7kktVMGOf6', 'Male', 1, 0, 'Nic', '2025-12-15 07:08:20');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `gracze_bronie`
--

CREATE TABLE `gracze_bronie` (
  `id_gracza` int(11) NOT NULL,
  `id_broni` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gracze_bronie`
--

INSERT INTO `gracze_bronie` (`id_gracza`, `id_broni`) VALUES
(8, 1),
(10, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `gracze_mapy`
--

CREATE TABLE `gracze_mapy` (
  `id_gracza` int(11) NOT NULL,
  `id_mapy` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gracze_mapy`
--

INSERT INTO `gracze_mapy` (`id_gracza`, `id_mapy`) VALUES
(8, 1),
(10, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `mapy`
--

CREATE TABLE `mapy` (
  `id_mapy` int(11) NOT NULL,
  `nazwa_mapy` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mapy`
--

INSERT INTO `mapy` (`id_mapy`, `nazwa_mapy`) VALUES
(3, 'Cache'),
(1, 'Dust II'),
(4, 'Inferno'),
(2, 'Mirage'),
(5, 'Nuke'),
(6, 'Train');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `bronie`
--
ALTER TABLE `bronie`
  ADD PRIMARY KEY (`id_broni`),
  ADD UNIQUE KEY `nazwa_broni` (`nazwa_broni`);

--
-- Indeksy dla tabeli `gracze`
--
ALTER TABLE `gracze`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeksy dla tabeli `gracze_bronie`
--
ALTER TABLE `gracze_bronie`
  ADD PRIMARY KEY (`id_gracza`,`id_broni`),
  ADD KEY `id_broni` (`id_broni`);

--
-- Indeksy dla tabeli `gracze_mapy`
--
ALTER TABLE `gracze_mapy`
  ADD PRIMARY KEY (`id_gracza`,`id_mapy`),
  ADD KEY `id_mapy` (`id_mapy`);

--
-- Indeksy dla tabeli `mapy`
--
ALTER TABLE `mapy`
  ADD PRIMARY KEY (`id_mapy`),
  ADD UNIQUE KEY `nazwa_mapy` (`nazwa_mapy`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bronie`
--
ALTER TABLE `bronie`
  MODIFY `id_broni` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `gracze`
--
ALTER TABLE `gracze`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `mapy`
--
ALTER TABLE `mapy`
  MODIFY `id_mapy` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `gracze_bronie`
--
ALTER TABLE `gracze_bronie`
  ADD CONSTRAINT `gracze_bronie_ibfk_1` FOREIGN KEY (`id_gracza`) REFERENCES `gracze` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gracze_bronie_ibfk_2` FOREIGN KEY (`id_broni`) REFERENCES `bronie` (`id_broni`) ON DELETE CASCADE;

--
-- Constraints for table `gracze_mapy`
--
ALTER TABLE `gracze_mapy`
  ADD CONSTRAINT `gracze_mapy_ibfk_1` FOREIGN KEY (`id_gracza`) REFERENCES `gracze` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gracze_mapy_ibfk_2` FOREIGN KEY (`id_mapy`) REFERENCES `mapy` (`id_mapy`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
