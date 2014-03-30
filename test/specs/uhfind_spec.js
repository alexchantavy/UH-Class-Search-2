var UHFind = require('../backend/uhfind.js');
var uhfind = new UHFind();


describe('uhfind object', function() {
	expectHasProperty(uhfind, 'baseUrl');
	expectHasProperty(uhfind, 'departments');
	expectHasFunction(uhfind, 'fetchDeptCourses');
});

describe('data scraped from uh catalog', function() {
	it ('should be non-null, non-empty data', function() {
    uhfind.fetchDeptCourses('ICS', function(result){
      expect(result).not.to.be.null;
      expect(result).to.be.an.object;
      expect(result.length > 0).to.equal(true);
	  });
  });
});



