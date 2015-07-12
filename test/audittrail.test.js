var Waterline = require('waterline'),
    findOne = require('../libs/findOne'),
    mocha = require('mocha'),
    should = require('../node_modules/should'),
    Waterline = require('../node_modules/waterline'),
    sailsmemory = require('../node_modules/sails-memory')

describe("Audit Trail Test",function(){

  var UserCollection = Waterline.Collection.extend({
      identity: 'user',
      connection: 'default',
      attributes: {
        name: {
          type: 'string'
        },
        company: {
            model:'Company',
            columnName:"companyID"
        },
        classMethod: function() {

        },
      }
    });
  var CompanyCollection = Waterline.Collection.extend({
    identity: 'company',
      connection: 'default',
      attributes: {
        companyName: {
          type: 'string'
        },
        empolyees: {
            collection:'User',
            columnName:"companyID"
        },
        classFunction: function() {

        }
      }
    });
  var waterline = new Waterline();
  var newConfig = {
    adapters: {
        'memory': sailsmemory
    },
    connections: {
      default: {
        adapter: 'memory'
      }
    }
  }

  var sailsConfig = {

  }

  var User,Company;

  before(function (done) {

     // Hook will timeout in 10 seconds
     this.timeout(11000);
      waterline.loadCollection(UserCollection);
      waterline.loadCollection(CompanyCollection);
     // Attempt to lift sails
       waterline.initialize(newConfig, function (err, ontology) {
          if (err) {
            done(err)
          }

          User = ontology.collections.user;
          Company = ontology.collections.company;
          done()
      });
  });

  describe("Create()",function() {
    it('should create a new company and Log',function(done) {
        //findOne(Company)
        console.log(Company);

        Company.create({},function(err,model){
          console(err);
          if(err)
            done(err)
          console(err);
          should(err).not.exists
          console.log(model)
          model.should.have.auditor
          done()
        });
        

    })
  });

  describe("Find()",function() {
    it('should only have name as attributes list',function(done) {
        findOne(Company)
        //console.log(Company);
        Company.findOne({},function(err,model){
          if(err)
            done(err)
          console(err);
          should(err).not.exists
          
          model.should.have.auditor
          done()
        });
        

    })
    it("Should only have companyName as attributes list",function(done) {
      done()
    })
  });
  describe("FindOne()",function() {
    it('should only have name as attributes list',function(done) {
        done()
    })
    it("Should only have companyName as attributes list",function(done) {
      done()
    })
  });
  
  describe("Update()",function() {
    
  });
  describe("Delete()",function() {
    
  })
});