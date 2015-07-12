(https://travis-ci.org/Antpolis/sails-hook-audittrail.svg?branch=master)
# Sails Audit Trail

## Introduction
Sails Audit Trail is to provide a simple way for tracking individual value changes. It will only log value changed and not value that is not changed.

## Limitation
- Log table is structured format
- Current only primary column are being tracked, means joined tabled data changed will not be log automatically
- Currently this implemtation is being built under the assumation of SQL and not for NoSql yet

## Installation
	npm install sails-hook-audittrail

## Configuration
### Global Configuration
./config/audittrail.js
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

	{

		auditorIgnoreAttr:['createdAt','updatedAt']
	}
- auditorIgnoreAttr must be a list of array of attributes that should be ignored when checking for data change

## Test
	npm test