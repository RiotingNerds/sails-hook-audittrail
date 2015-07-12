'use strict';
//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred'),
    Auditor = require('./auditor'),
    ultis = require('./ultis'),
    async = require('async'),
    _ = require('lodash')

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
        	if(!err) {
        		sailsDestroy
		            .call(model, criteria, function(error, result) {
		                if (error) {
		                    callback(error);
		                } else {
                            var auditingFunc = []
                            var PK = ultis.getPK(model)
							_.forEach(result,function(value) {
	                            _.forEach(foundResult,function(originalValue) {
	                                if(originalValue[PK] == value[PK]) {
                                        var audit = function(cb) {
                                            originalValue.auditor.startAuditing({},null,cb)
                                        }
                                        auditingFunc.push(audit)
                                    }
	                            })
	                        })
                            async.parallel(auditingFunc, function(asyncErr){
                                callback(asyncErr, result);
                            });
		                    
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