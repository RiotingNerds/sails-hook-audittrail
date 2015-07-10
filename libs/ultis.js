'use strict'
var _ = require('../node_modules/lodash');

module.exports = {
	getPK: function(model) {
		var PK = 'id';
		if(model.hasOwnProperty('auditorPK')) {
			PK = model['auditorPK']
		} else if(model.hasOwnProperty('primaryKey')) {
			PK = model.primaryKey
		} else {
			if(!_.isUndefined(model.attributes)) {
				_.forEach(model.attributes,function(value,key) {
					if(value.hasOwnProperty('autoPK')) {
						PK = key
					}
				})
			}
		}
		return PK;
	},
	isIgnore: function(model) {
		if(model.hasOwnProperty('auditorIgnore')) {
			if(model.auditorIgnore === true)
				return false;
		}
		return true;
	}
}