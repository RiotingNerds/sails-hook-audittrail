'use strict';
//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred'),
    Auditor = require('./auditor'),
    afterUpdate = require('./afterUpdate'),
    _ = require('../node_modules/lodash')

/**
 * @description path sails `update()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 */
module.exports = function(model) {
    //remember sails defined update
    //method
    //See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/finders/basic.js
    var sailsFindOne = model.findOne;
    model.auditor = {};
    console.log('yeysys');
    //prepare new update method
    //which wrap sailsUpdate
    //with custom error message checking
    function findOne(criteria, callback) {
       	// if no callback passed
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/finders/basic.js#L49
        if(typeof callback !== 'function') {
	      return sailsFindOne.call(model,criteria,null);
	    }

        var joins = criteria.joins || [];
        var attributes = model.attributes;
        
        //helper.getAttributesName();
        sailsFindOne.call(model,criteria,function(err,results) {
            results.auditor = new Auditor(model,criteria,results);

	        callback(err,results);
        });
    }
    var oldAfterUpdate = model.afterUpdate;
    model.afterUpdate = function(updatedValue,cb) {
        console.log(updatedValue);
        afterUpdate(updatedValue,cb,oldAfterUpdate);
    }

    //bind our new update
    //to our models
    model.findOne = findOne;
};