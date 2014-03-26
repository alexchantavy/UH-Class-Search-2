describe("UH find module", function() {
	var uhfind = require('../backend/uhfind');
  	it ("Should have a list of departments", function() {
  		expectHasProperty(uhfind, departments);
  		expectHasProperty(uhfind, fetchDeptCourses);
  	}

	// describe("PhantomJs grabbing a webpage", function() {
	//     var page = require('webpage').create();

	//     it("Should return a data object that isn't null", function() {
	// 	    page.content = f.read();
	// 		page.content.should.not.equal(null);
	// 		//scrapePage(function(data) {
	// 		//  expect(data.length).toEqual(61);
	// 		//});
	// 	});
        
	// });
});
