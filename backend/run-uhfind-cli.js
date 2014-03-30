
var system = require('system');

if (system.args.length === 1) {
    console.log('Try to pass some args when invoking this script!');
} 
else {
  var UHFind = require('./uhfind.js');
  var uhfind = new UHFind();

  uhfind.fetchDeptCourses(system.args[1], function(res){
    console.log(JSON.stringify(res));
    phantom.exit();
  });
}

