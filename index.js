//dependencies
var path = require('path');
var libPath = path.join(__dirname, 'libs');

var findOne = require(path.join(libPath, 'findOne'));
var saveMethod = require(path.join(libPath, 'save'));

module.exports = function(sails) {
	function patch() {
        sails
            .util
            ._(sails.models)
            .forEach(function(model) {
                //bind path validate
                //on concrete models
                //and left derived model
                //build from associations
                if (model.globalId) {
            		findOne(model);
                    saveMethod(model);
                    //patch sails `create()` method
                    
                }
            });
    }

	return {
        //intercent all request and current grab request locale
        

        initialize: function(done) {
        	sails.after('hook:orm:loaded', function() {
                    //bind custom errors logic
                    //and let sails to continue
                    patch();
                    done();
                });
        }
    };
}