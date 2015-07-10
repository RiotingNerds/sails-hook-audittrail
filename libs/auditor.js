'use strict';
var _ = require('../node_modules/lodash'),
	ultis = require('./ultis')

module.exports = function(model,results) {

	var referanceModel = model;

	var constructor = {};

	var _attributes = [];

	var attributes = {};

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

	var getValueDiff = function(newValues) {
		var changedValue = []
		var originalValues = getOriginalAttributeValues();
		var d = new Date();
		var timestamp = d.getTime();
		_.forEach(originalValues,function(value,key){
			var newValue = '';
			if(newValues.hasOwnProperty(key)) {
				if(value !== newValues[key]) {
					newValue = newValues[key]
				}
			}
			changedValue.push({
				column:key,
				oldValue:value,
				newValue:newValues[key],
				modelID:referanceModel.globalId,
				timestamp: timestamp,
				foreignKey:newValues[PK] || originalValues[PK],
				operation: currentOperation
			});
		});
		return changedValue;
	}

	var saveDiff = function(changedValue) {
		console.log(changedValue);
	}

	var startAuditing = function(newValues,operation) {
		if(_.size(newValues)==0)
			currentOperation = availableOpertaion.del
		if(!_.isUndefined(operation))
			currentOperation = operation
		var changedValue = getValueDiff(newValues);
		saveDiff(changedValue);
	}
	if(_attributes.length == 0) {
		var loopingAttr = referanceModel.attributes;
		if(referanceModel.hasOwnProperty('_attributes'))
			loopingAttr = referanceModel._attributes;
		
		_.forEach(loopingAttr,function(value,key){
			if(!_.isFunction(value)) {
				if(_.isUndefined(model.auditorIgnoreAttr) || _.indexOf(model.auditorIgnoreAttr,key)<0) {
					if(!value.hasOwnProperty('collection')) {
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