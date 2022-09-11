-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 10-09-2022 a las 20:07:01
-- Versión del servidor: 10.5.16-MariaDB-cll-lve
-- Versión de PHP: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tradersa_Cryptofertas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `NFT_Cache`
--

CREATE TABLE `NFT_Cache` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'Autoincremental ID',
  `tokenId` int(10) UNSIGNED NOT NULL COMMENT 'Token Id in NFT SC',
  `lastRefreshed` datetime NOT NULL COMMENT 'Last modification timestamp',
  `price` varchar(64) NOT NULL COMMENT 'Actual Price of the NFT',
  `used` tinyint(1) NOT NULL COMMENT 'Is the NFT Used?',
  `forSale` tinyint(1) NOT NULL COMMENT 'Is the NFT for sale?',
  `owner` varchar(42) NOT NULL COMMENT 'Who is the NFT owner?',
  `provider` varchar(42) NOT NULL COMMENT 'Who is the product provider?',
  `embassador` varchar(42) NOT NULL COMMENT 'Who created the NFT?',
  `tokenUri` varchar(160) NOT NULL COMMENT 'Where is the NFT info?',
  `choose` int(10) UNSIGNED NOT NULL COMMENT 'order tfor updates',
  `dirty` tinyint(1) NOT NULL COMMENT 'is an update needed?'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='table to cache info';

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `NFT_Cache`
--
ALTER TABLE `NFT_Cache`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `NFT_Cache`
--
ALTER TABLE `NFT_Cache`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Autoincremental ID';
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
