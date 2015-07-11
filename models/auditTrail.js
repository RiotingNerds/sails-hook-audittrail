'use strict'
var _ = require('../node_modules/lodash'),
	Waterline = require('sails/node_modules/waterline'),
	mysql = require('../node_modules/sails-mysql')

module.exports = function(config) {
	var table = "audittrail"
	if(config.hasOwnProperty('tableName'))
		table = config.tableName

	var waterline = new Waterline();

	_.extend(config.connection,{adapter:'sails-mysql'})

	var newConfig = {
		adapters: {
            'sails-mysql': mysql
        },
		connections: {
			default: config.connection
		}
	}
	var auditModel = Waterline.Collection.extend({
		identity: 'audittrail',
	  // Define a custom table name
	  tableName: table,

	  // Set schema true/false for adapters that support schemaless
	  schema: true,

	  // Define an adapter to use
	  connection: 'default',

	  // Define attributes for this collection
	  attributes: {
	  	columnName: {
	  		type: 'string'
	  	},
	  	oldValue: {
	  		type: 'string'
	  	},


	  	newValue: {
	  		type: 'string'
	  	},
	  	modelID:{
	  		type: 'string'
	  	},

	  	timestamp: {
	  		type: 'string'
	  	},
	  	foreignKey:{
	  		type: 'string'

	  	},
	  	operation: {
	  		type: 'string'
	  	}
	  }
	});
	waterline.loadCollection(auditModel);
	var init = function(cb) {
		waterline.initialize(newConfig, function (err, ontology) {
			if (err) {
				cb(err)
			}

			var Audit = ontology.collections.audittrail;
			cb(null,Audit)
		});
	}
	return {
		init:init
	}
}