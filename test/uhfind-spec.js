describe("UH find methods", function() {
  
	describe("UHFind object constructor", function() {
	    it("should exist in window", function() {
	        expect(window.hasOwnProperty('UHFind')).toBeTruthy();
	    });

	    it("should be a function", function() {
	        expect(typeof window.UHFind).toEqual('function');
	    });
	});

});
