'use strict';
//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred'),
    Auditor = require('./auditor')

/**
 * @description path sails `create()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 * @param  {Function} validateCustom a function to transform sails `ValidationError`
 *                                   to custome `Errors`
 */
module.exports = function(model,config) {
    //remember sails defined create
    //method
    //See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/dql/create.js
    var sailsDestroy = model.destroy;
    
    //prepare new create method
    //which wrap sailsCreate
    //with custom error message checking
    function destroy(criteria, callback) {

        // return Deferred
        // if no callback passed
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/dql/create.js#L54
        if (typeof callback !== 'function') {
            //this refer to the
            //model context
            return new Deferred(model, model.destroy, criteria);
        }

        //otherwise
        //call sails create
        model.find(criteria,function(err,foundResult) {
        	console.log(foundResult);
        	if(!err) {
        		sailsDestroy
		            .call(model, criteria, function(error, result) {
		                if (error) {
		                    callback(error);
		                } else {
							_.forEach(result,function(value) {
	                            _.forEach(foundResult,function(originalValue) {
	                                originalValue.auditor.startAuditing({});
	                            })
	                        })
		                    callback(null, result);
		                }
		            });
        	} else {
        		callback(err);
        	}
        })
        
    }

    //bind our new create
    //to our models
    model.destroy = destroy;
};