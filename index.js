//dependencies
var path = require('path'),
    libPath = path.join(__dirname, 'libs'),
    findOne = require(path.join(libPath, 'findOne')),
    findM = require(path.join(libPath, 'find')),
    update = require(path.join(libPath, 'update'))

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
                    findM(model);
                    update(model);
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