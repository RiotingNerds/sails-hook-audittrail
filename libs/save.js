'use strict';
//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred'),
    Auditor = require('./auditor');

/**
 * @description path sails `update()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 */
module.exports = function(model) {
    //remember sails defined update
    //method
    //See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/finders/basic.js
    var sailsSave = model.save;
    //prepare new update method
    //which wrap sailsUpdate
    //with custom error message checking
    function saveMethod(callback) {
       	// if no callback passed
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/finders/basic.js#L49
        if(typeof callback !== 'function') {
	      return sailsSave.call(model,null);
	    }
        console.log("yes");
        sailsSave.call(model,function(err,newResult) {
            console.log(model.auditor.getOriginalAttributeValues);
            if(!err) {

            }
	        callback(err,results);
        });
    }

    //bind our new update
    //to our models
    model.save = saveMethod;
};