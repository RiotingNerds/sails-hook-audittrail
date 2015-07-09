'use strict';
var _ = require('../node_modules/lodash');

module.exports = function(model,criteria,results,ignoreAttr) {

	var referanceModel = model;

	var criteria = criteria;

	var constructor = {};

	var _attributes = [];

	var joins = [];

	var attributes = {};

	if(_attributes.length == 0) {
		_.forEach(referanceModel.attributes,function(value,key){
			if(!_.isFunction(value)) {
				if(_.isUndefined(ignoreAttr) || _.indexOf(ignoreAttr,key)<0) {
					if(!value.hasOwnProperty('collection')) {
						_attributes.push(key);
					}
				}
			}
		});
	}



	var getAttributesName = function () {
		return _attributes;
	}

	var setValues = function(values) {
		_.forEach(_attributes,function(value){
			if(values.hasOwnProperty(value))
				attributes[value] = values[value];
		})
	}

	var getOriginalAttributeValues = function() {
		return attributes;
	}

	var getValueDiff = function(newValues) {
		var changedValue = {};
		var originalValues = getOriginalAttributeValues();
		var d = new Date();
		var timestamp = d.getTime();
		changedValue[timestamp] = []
		_.forEach(originalValues,function(value,key){
			if(newValues.hasOwnProperty(key)) {
				if(value !== newValues[key]) {
					changedValue[timestamp].push({
						column:key,
						oldValue:value,
						newValue:newValues[key],
						modelID:referanceModel.globalId
					});
				}
			}
		});
		return changedValue;
	}

	var saveDiff = function(changedValue) {
		console.log(changedValue);
	}

	var startAuditing = function(newValues) {
		var changedValue = getValueDiff(newValues);
		saveDiff(changedValue);
	}

	if(!_.isUndefined(results)) {
		setValues(results);
	}



	constructor = {
		startAuditing:startAuditing,
		attributes:attributes
	}

	return constructor;
}