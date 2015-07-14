'use strict';
//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred'),
    _ = require('lodash'),
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
    var sailsCreate = model.create;

    //prepare new create method
    //which wrap sailsCreate
    //with custom error message checking
    function create(values, callback) {

        // handle Deferred where 
        // it passes criteria first
        // see https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/dql/create.js#L26
        if (arguments.length === 3) {
            var args = Array.prototype.slice.call(arguments);
            callback = args.pop();
            values = args.pop();
        }

        // return Deferred
        // if no callback passed
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/dql/create.js#L54
        if (typeof callback !== 'function') {
            //this refer to the
            //model context
            return new Deferred(model, model.create, {}, values);
        }

        //otherwise
        //call sails create
        sailsCreate
            .call(model, values, function(error, result) {
                if (error) {
                    callback(error);
                } else {
                    if(!_.isUndefined(result)) {
                        result.auditor = new Auditor(model,config)
                        result.auditor.startAuditing(result,null,function(err) {
                            if(err)
                                callback(err) 
                            callback(null, result);
                        })    
                    } else {
                        callback(null, result);    
                    }
                    
                }
            });
    }

    //bind our new create
    //to our models
    model.create = create;
};