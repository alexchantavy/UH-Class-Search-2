var UHFind = require('./uhfind.js');
var uhfind = new UHFind();

uhfind.fetchDeptCourses('ICS', function(res){
	console.log(JSON.stringify(res));
});