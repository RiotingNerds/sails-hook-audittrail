'use strict';
//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred');

/**
 * @description path sails `update()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 * @param  {Function} validateCustom a function to transform sails `ValidationError`
 *                                   to custome `Errors`
 */
module.exports = function(model) {
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
            sailsUpdate
                .call(model, criterias, values, function(error, result) {
                    //any update error
                    //found?
                    if (error) {
                        callback(error);
                    } else {
                        //no error
                        //return
                        _.forEach(result,function(value) {
                            _.forEach(results,function(originalValue) {
                                
                                if(originalValue['id'] == value['id']) {
                                    originalValue.auditor.startAuditing(value);
                                }
                            })
                        })
                        callback(null, result);
                    }
                });
        }) 

        //otherwise
        //call sails update
        
    }

    //bind our new update
    //to our models
    model.update = update;
};