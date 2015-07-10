var Waterline = require('waterline'),
    findOne = require('../libs/findOne'),
    mocha = require('mocha')
    should = require('../node_modules/should')

describe("Audit Trail Test",function(){

  var User = Waterline.Collection.extend({
 
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
  var Company = Waterline.Collection.extend({
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

  describe("Find()",function() {
    it('should only have name as attributes list',function(done) {
        //findOne(Company)
        Company({},function(err,model){
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
  describe("Save()",function() {
    
  });
  describe("Update()",function() {
    
  });
  describe("Delete()",function() {
    
  })
});