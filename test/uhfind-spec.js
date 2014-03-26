// run $> phantomjs run-tests.js  !!

describe("UH find methods", function() {
  
	describe("UH find scrapePage()", function() {
	    var page = require('webpage').create();

	    it("returns the expected number of courses", function() {
	    	// workaround for local path in phantomjs from https://github.com/ariya/phantomjs/issues/10330
		    var f = fs.open('./testdata/ics.html', 'r');
			page.content = f.read();
			expect(page.content).to.be.ok;
			//scrapePage(function(data) {
			//  expect(data.length).toEqual(61);
			//});
		});
        
	});

//	describe("Count Rows", function() {
//		page
//	};
});
