'use strict';
//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred');

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

    //prepare new update method
    //which wrap sailsUpdate
    //with custom error message checking
    function findOne(criteria, callback) {

       	// if no callback passed
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/finders/basic.js#L49
        if(typeof callback !== 'function') {
	      return new Deferred(model, model.findOne, criteria);
	    }
	    console.log(criteria);
        //otherwise
        //call sails update
        model.findOne(criteria,function(err,results) {
        	 
        	 if(!err) {
        	 	console.log(results);
        	 }
	        //callback(err,results);
        });
    }

    //bind our new update
    //to our models
    model.findOne = findOne;
};