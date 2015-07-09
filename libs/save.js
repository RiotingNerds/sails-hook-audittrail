'use strict';
//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred'),
    Auditor = require('./auditor'),
    defaultMethods = require('sails/node_modules/waterline/lib/waterline/model/lib/defaultMethods')
/**
 * @description path sails `update()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 */
module.exports = function(classInstance,model) {
    var save = function(cb) {
        var newSave = function (err,newResult) {
            model.auditor.startAuditing(newResult);
            if(typeof cb === 'function') {
                cb(err,newResult);
            }
        }
        return new defaultMethods.save(classInstance, model, newSave);
    }
    return save;
};