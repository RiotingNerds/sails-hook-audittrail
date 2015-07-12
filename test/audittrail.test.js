var Waterline = require('waterline'),
    findOne = require('../libs/findOne'),
    findMethod = require('../libs/find'),
    update = require('../libs/update'),
    destroy = require('../libs/delete'),
    create = require('../libs/create'),
    mocha = require('mocha'),
    should = require('../node_modules/should'),
    _ = require('../node_modules/lodash'),
    Waterline = require('../node_modules/waterline'),
    sailsmemory = require('../node_modules/sails-memory'),
    auditModel = require('../models/audittrail')

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
      globalId: 'Company',
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
     connection: {
        adapter: 'sails-memory'
     },
     excludedModels: [],
     tableName:'audittrail'
  }

  var User,Company,AuditModel;

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

          auditModel(sailsConfig).init(function(err,auditModel) {
              AuditModel = auditModel
              done();
          });

          
      });
  });
  describe("Create()",function() {
    it('should patch correctly to create method',function(done) {
      create(Company,sailsConfig)
      done();
    })
    it('should create a new company and Log',function(done) {
        Company.create([{companyName:"testing company"},{companyName:'another testing company'}],function(err,model) {
          //err.should.not.exists
          AuditModel.findOne({
            columnName:'companyName',
            newValue:'testing company'
          }).exec(function(err,result) {
            should.not.exist(err)
            result.should.have.property('operation','insert')
            result.should.have.property('newValue','testing company')
            AuditModel.find({
              modelID:result.modelID
            },function(err,result) {
              should(result).have.length(8)
              done()  
            })
            
          })
        })
    })
  });

  describe("FindOne()",function() {
    it('should have auditor object in result found with the attribute property',function(done) {
        findOne(Company,sailsConfig)
        Company.findOne({id:1},function(err,model){
          should.not.exist(err)
          model.should.have.property('auditor')
          model.auditor.should.not.be.empty()
          model.auditor.should.have.property('attributes')
          done()
        });
    });
  });
  describe("Find()",function() { 
    it('should only have name as attributes list',function(done) {
        findMethod(Company,sailsConfig)
        Company.find({},function(err,model) {
          should.not.exist(err)
          model.should.have.length(2)
          _.forEach(model,function(value){
            value.should.have.property('auditor')
          })
          done()  
        })
        
    })
  });
  
  describe("Update()",function() {
    it('should update and log',function(done){
      update(Company,sailsConfig)
      // Force 1s delay to make sure updatedAt is not the same.
      setTimeout(function(){
          Company.update({id:1},{companyName:'change company name'},function(err,results){
            should.not.exist(err)
            results.should.have.length(1)
            AuditModel.find({
                foreignKey:1
              },function(err,result) {
                should(result).have.length(6)
                result[4].should.have.property('columnName','companyName')
                result[4].should.have.property('newValue','change company name')
                result[4].should.have.property('oldValue','testing company')
                result[4].should.have.property('operation','update')
                done()  
              })
          })
      },1000)
    })
  });
  describe("Delete()",function() {
    it('should delete the record and log empty newValue',function(done){
      destroy(Company,sailsConfig)
      Company.destroy({id:1},function(err,results){
        should.not.exist(err)
        results.should.have.length(1)
        AuditModel.find({
            foreignKey:1
          },function(err,result) {
            should(result).have.length(10)
            var checkResult = result[6]
            checkResult.should.have.property('operation','delete')
            checkResult.should.have.property('columnName','companyName')
            checkResult.should.have.property('newValue','')
            checkResult.should.have.property('oldValue','change company name')
            done()  
          })
      })
    })
  })
  describe('Save()',function(){
    it('should be able to save and log the found result',function(done){
      Company.findOne(2,function(err,result){
        should.not.exist(err)
        result.companyName = 'change company name for second';
        // Force 1s delay to make sure updatedAt is not the same.
        setTimeout(function() {
          result.save(function(err,newResult){
            AuditModel.find({
              foreignKey:2
            },function(err,auditResult) {
              should(auditResult).have.length(6)
              done()  
            })
        })
        },1000)
        
      })
    })
  })
});