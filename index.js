//dependencies
var path = require('path'),
    libPath = path.join(__dirname, 'libs'),
    findOne = require(path.join(libPath, 'findOne')),
    findM = require(path.join(libPath, 'find')),
    findOrCreate = require(path.join(libPath,'findOrCreate')),
    update = require(path.join(libPath, 'update')),
    create = require(path.join(libPath,'create')),
    destory = require(path.join(libPath,'delete')),
    ultis = require(path.join(libPath,'ultis')),
    auditModel = require('./models/audittrail')

module.exports = function(sails) {


	function patch() {
        var config = {}
        if(sails.config.hasOwnProperty('audittrail'))
            config = sails.config.audittrail

        if(sails.config.connections.hasOwnProperty(config.connection)) {
            config.connection = sails.config.connections[config.connection]
        }
        auditModel(config).init(function(err,auditModel) {
            config.model = auditModel
            sails
                .util
                ._(sails.models)
                .forEach(function(model) {
                    //bind path validate
                    //on concrete models
                    //and left derived model
                    //build from associations
                    if (model.globalId && !ultis.isExcluded(model,config)) {
                        findOne(model,config);
                        findM(model,config);
                        update(model,config);
                        findOrCreate(model,config);
                        create(model,config)
                        destory(model,config)
                        //patch sails `create()` method
                    }
                });
        })
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