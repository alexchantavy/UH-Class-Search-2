var UHFind = require('./uhfind.js');
var uhfind = new UHFind();

uhfind.departments.forEach(function(dept) {
  setTimeout(function() {

    uhfind.fetchDeptCourses(dept, function(res){
      console.log(dept);
      console.log(JSON.stringify(res));
    });

  }, 3000);

	
});



