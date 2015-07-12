'use strict';
//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred'),
    Auditor = require('./auditor'),
    _ = require('lodash'),
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
    var sailsFind = model.find;
    model.auditor = {};
    //prepare new update method
    //which wrap sailsUpdate
    //with custom error message checking
    function find(criteria, callback) {
       	// if no callback passed
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/finders/basic.js#L49
        if(typeof callback !== 'function') {
	      return sailsFind.call(model,criteria,null);
	    }
        //helper.getAttributesName();
        sailsFind.call(model,criteria,function(err,results) {
        	if(err) {
        		callback(err);
        	} else {
        		var newResults = [];
	        	_.forEach(results,function(value) {
	        		value.auditor = new Auditor(model,config,value);

                    if(!_.isObject(value.save))
                        value.save = save(model,value);
	            	
	            	newResults.push(value);
	        	})
		        callback(err,newResults);
        	}
        });
    }

    //bind our new update
    //to our models
    model.find = find;
};