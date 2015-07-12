'use strict';
//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred'),
    Auditor = require('./auditor'),
    _ = require('../node_modules/lodash'),
    save = require('./save.js')

/**
 * @description path sails `update()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 */
module.exports = function(model,config) {
    //remember sails defined update
    //method
    //See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/finders/basic.js
    var sailsFindOne = model.findOne;
    model.auditor = {};
    //prepare new update method
    //which wrap sailsUpdate
    //with custom error message checking
    function findOne(criteria, callback) {
       	// if no callback passed
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/finders/basic.js#L49
        if(typeof callback !== 'function') {
	      return sailsFindOne.call(model,criteria,null);
	    }
        //helper.getAttributesName();
        sailsFindOne.call(model,criteria,function(err,results) {
            results.auditor = new Auditor(model,config,results);
            results.save = save(model,results);
	        callback(err,results);
        });
    }

    //bind our new update
    //to our models
    model.findOne = findOne;
};