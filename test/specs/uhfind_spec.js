var UHFind = require('../backend/uhfind.js');
var uhfind = new UHFind();

describe('fetchDeptCourses()', function() {
  it('should return data as expected', function(done) {
    uhfind.fetchDeptCourses('ICS', function(result) {
      jasmine.log(JSON.stringify(result));
      expect(result).not.to.be.null;
      expect(result).to.be.an.object;
      expect(result.length > 0).to.equal(true);
      done();
	  });
  });
});



