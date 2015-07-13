'use strict'
var _ = require('lodash'),
	Waterline = require('sails/node_modules/waterline')

module.exports = function(config) {
	var table = "audittrail"
	if(config.hasOwnProperty('tableName'))
		table = config.tableName

	var waterline = new Waterline();
	

	var includeModule = config.connection.adapter || config.connection.module

	var dbModule = require(includeModule)

	var newConfig = {
		adapters: {

		},
		connections: {
			auditorAdapterConnection: config.connection
		}
	}
	
	newConfig['adapters'][includeModule] = dbModule
	
	var auditModel = Waterline.Collection.extend({
		identity: 'audittrail',
	  // Define a custom table name
	  tableName: table,

	  // Set schema true/false for adapters that support schemaless
	  schema: true,

	  // Define an adapter to use
	  connection: 'auditorAdapterConnection',

	  // Define attributes for this collection
	  attributes: {
	  	columnName: {
	  		type: 'string',
	  		maxLength:1024
	  	},
	  	oldValue: {
	  		type: 'text'
	  	},
	  	newValue: {
	  		type: 'text'
	  	},
	  	modelID:{
	  		type: 'string',
	  		maxLength:255
	  	},

	  	timestamp: {
	  		type: 'int',	  		
	  	},
	  	foreignKey:{
	  		type: 'string',
	  		maxLength:125

	  	},
	  	operation: {
	  		type: 'string',
	  		maxLength:15
	  	}
	  }
	});
	waterline.loadCollection(auditModel);
	if(_.isUndefined(newConfig.connections.auditorAdapterConnection.adapter)) {
		newConfig.connections.auditorAdapterConnection.adapter = includeModule
	}


	var init = function(cb) {
		waterline.initialize(newConfig, function (err, ontology) {
			if (err != null) {
				cb(err)
			}
			var Audit = ontology.collections.audittrail;
			config.model = Audit
			cb(null,Audit)
		});
	}
	return {
		init:init
	}
}