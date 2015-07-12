'use strict';
var _ = require('lodash'),
	ultis = require('./ultis'),
	modelAudit = require('../models/auditTrail')

module.exports = function(model,config,results) {

	var referanceModel = model;

	var constructor = {};

	var _attributes = [];

	var attributes = {};

	var convAttr = {}

	var Auditor =config.model

	var availableOpertaion = {
		create:'insert',
		update:'update',
		del:'delete'
	}

	var currentOperation = availableOpertaion.create

	var PK = ultis.getPK(model);


	var getAttributesName = function () {
		return _attributes;
	}

	var setValues = function(values) {
		_.forEach(_attributes,function(value){
			if(values.hasOwnProperty(value))
				attributes[value] = values[value];
			else
				attributes[value] = '';
		})
		
	}

	var getOriginalAttributeValues = function() {
		return attributes;
	}

	var normalizeValue = function(value) {
		var returnValue = value
		if(_.isNumber(value) || _.isDate(value)) {
			returnValue = value.toString();
		}
		return returnValue
	}

	var getValueDiff = function(newValues) {
		var changedValue = []
		var originalValues = getOriginalAttributeValues();
		var d = new Date();
		var timestamp = d.getTime();
		_.forEach(originalValues,function(value,key){
			var newValue = '';
			var foreignKey = newValues[PK] || originalValues[PK]
			if(foreignKey != '') {
				value = normalizeValue(value)

				var normalizeDiffValue = function(checkKey){
					var returnValue = '';
					if(newValues.hasOwnProperty(checkKey)) {
						newValues[checkKey] = normalizeValue(newValues[checkKey])
						if(value !== newValues[checkKey]) {
							returnValue = newValues[checkKey]
						}
					}
					return returnValue
				}

				newValue = normalizeDiffValue(key)
				if(convAttr.hasOwnProperty(key) && newValue == '') {
					newValue = normalizeDiffValue(convAttr[key])
				}

				if(newValue != '' || currentOperation == availableOpertaion.del) {
					changedValue.push({
						columnName:key,
						oldValue:value,
						newValue:newValue,
						modelID:referanceModel.globalId,
						timestamp: timestamp,
						foreignKey:foreignKey,
						operation: currentOperation
					});
				}
				
			}
		});
		return changedValue;
	}

	var saveDiff = function(changedValue,cb) {
		
		Auditor.create(changedValue,function(err,result) {
			if(!_.isUndefined(cb)) {
				if(err)
					cb(err)
				else 
					cb(null)
			}
			
		})
	}

	var startAuditing = function(newValues,operation,callback) {

		if(_.size(newValues)==0)
			currentOperation = availableOpertaion.del
		if(!_.isUndefined(operation) && operation != null)
			currentOperation = operation
		var changedValue = getValueDiff(newValues);
		saveDiff(changedValue,callback);
	}
	if(_attributes.length == 0) {
		var loopingAttr = referanceModel.attributes;
		if(referanceModel.hasOwnProperty('_attributes'))
			loopingAttr = referanceModel._attributes;
		
		_.forEach(loopingAttr,function(value,key){
			if(!_.isFunction(value)) {
				if(_.isUndefined(model.auditorIgnoreAttr) || _.indexOf(model.auditorIgnoreAttr,key)<0) {
					if(!value.hasOwnProperty('collection')) {
						var colName = key
						if(value.hasOwnProperty('columnName'))
							convAttr[key]=value['columnName']
						_attributes.push(key);
					}
				}
			}
		});
		setValues({})
	}
	if(!_.isUndefined(results)) {
		setValues(results);
		currentOperation = availableOpertaion.update
	}


	constructor = {
		startAuditing:startAuditing,
		attributes:attributes,
		setDefaultValue:setValues,
		operation: availableOpertaion
	}

	return constructor;
}