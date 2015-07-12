# Sails Audit Trail  
> Sails Audit Trail is to provide a simple way for tracking individual value changes. It will only log value changed and not value that is not changed.

[![travis test](https://travis-ci.org/Antpolis/sails-hook-audittrail.svg?branch=master)](https://travis-ci.org/Antpolis/sails-hook-audittrail) [![npm version](https://badge.fury.io/js/sails-hook-audittrail.svg)](http://badge.fury.io/js/sails-hook-audittrail)

## Limitation
- Log table is in structured format, so doesn't really benefit from NoSQL if its being used as log DB
- Current only primary column are being tracked, means joined tabled data changed will not be log automatically
- Currently this implemtation is being built under the assumation of SQL and not for NoSql yet

## Installation
	npm install sails-hook-audittrail

## Configuration
### Global Configuration

	// config/audittrail.js
	module.exports.audittrail = {
	   connection: "localDatabase",
	   excludedModels: [],
	   tableName:'audittrail'
	};
- connection will be the connection string set in 'config/connection.js'
- excludedModels must be a list of array of model.globalId, globalId specific in this array will not be patched
- tableName is the tableName to be used as log table.

### Local Configuration
This will be individual configuration available for individual model. 

	module.exports = {
		tableName: "user",
		attributes: {
			'name': {
				type:'text'
			}
		},
		auditorIgnoreAttr:['createdAt','updatedAt']
	}
- auditorIgnoreAttr must be a list of array of attributes that should be ignored when checking for data change

### Database Schema
	SET FOREIGN_KEY_CHECKS=0;
	DROP TABLE IF EXISTS `audittrail`;
	CREATE TABLE `audittrail` (
	  `columnName` varchar(1024) CHARACTER SET latin1 DEFAULT NULL,
	  `oldValue` longtext CHARACTER SET latin1,
	  `newValue` longtext CHARACTER SET latin1,
	  `modelID` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
	  `timestamp` int(11) DEFAULT NULL,
	  `foreignKey` varchar(125) CHARACTER SET latin1 DEFAULT NULL,
	  `operation` varchar(15) CHARACTER SET latin1 DEFAULT NULL,
	  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	  `createdAt` datetime DEFAULT NULL,
	  `updatedAt` datetime DEFAULT NULL,
	  PRIMARY KEY (`id`),
	  KEY `search` (`modelID`,`foreignKey`,`columnName`(767))
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;

The sql file is in data folder
	
## Test
	npm test
