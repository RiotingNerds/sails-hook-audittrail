'use strict';
//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred'),
    Auditor = require('./auditor'),
    ultis = require('./ultis'),
    _ = require('lodash'),
    async = require('async')

/**
 * @description path sails `update()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 * @param  {Function} validateCustom a function to transform sails `ValidationError`
 *                                   to custome `Errors`
 */
module.exports = function(model,config) {
    //remember sails defined update
    //method
    //See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/dql/update.js
    var sailsUpdate = model.update;

    //prepare new update method
    //which wrap sailsUpdate
    //with custom error message checking
    function update(criterias, values, callback) {

        // return Deferred
        // if no callback passed
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/dql/update.js#L34
        if (typeof callback !== 'function') {
            //this refer to the
            //model context
            return new Deferred(model, model.update, criterias, values);
        }
        
        model.find(criterias,function(err,results) {
            if(err)
                callback(err)
            else {
                sailsUpdate
                    .call(model, criterias, values, function(error, result) {
                        //any update error
                        //found?
                        if (error) {
                            callback(error);
                        } else {
                            //no error
                            //return
                            var PK = ultis.getPK(model)
                            var auditingFunc = []
                            _.forEach(result,function(value) {
                                _.forEach(results,function(originalValue) {                                      
                                    if(originalValue[PK] == value[PK]) {
                                        var audit = function(cb) {
                                            originalValue.auditor.startAuditing(value,null,cb)
                                        }
                                        auditingFunc.push(audit)
                                    }
                                })
                            });
                            async.parallel(auditingFunc, function(asyncErr){
                                callback(asyncErr, result);
                            });
                        }
                    });
                }
            
        }) 

        //otherwise
        //call sails update
        
    }

    //bind our new update
    //to our models
    model.update = update;
};