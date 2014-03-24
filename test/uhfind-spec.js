describe("UH find methods", function() {
  
	describe("UH find scrapePage()", function() {
	    var page = require('webpage').create();

	    it("returns the expected number of courses", function() {
		    var f = fs.open('../test/testdata/ics.html', 'r');
			page.content = f.read();
			scrapePage(function(data) {
			  expect(data.length).toEqual(61);
			});
		});
        
	});
});
