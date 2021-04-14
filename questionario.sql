CREATE DATABASE IF NOT EXISTS `questionario`;
USE `questionario`;

CREATE TABLE IF NOT EXISTS `risposte` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `risposte` mediumtext NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=utf8mb4;