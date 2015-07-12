'use strict'
var _ = require('lodash');

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
	},
	isExcluded: function(model,config) {
		if(_.size(config) && config.hasOwnProperty('excludedModels')) {
			if(config.excludedModels.indexOf(model.globalId) >=0) {
				return true;
			}
		}
		return false;
	}
}