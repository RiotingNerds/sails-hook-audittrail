var Waterline = require('waterline');

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
        
    })
    it("Should only have companyName as attributes list",function(done) {
      
    })
  });
  describe("FindOne()",function() {
    it('should only have name as attributes list',function(done) {
        
    })
    it("Should only have companyName as attributes list",function(done) {
      
    })
  });
  describe("Save()",function() {
    
  });
  describe("Update()",function() {
    
  });
  describe("Delete()",function() {
    
  })
});