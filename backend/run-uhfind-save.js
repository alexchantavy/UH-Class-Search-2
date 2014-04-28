
/* 
don't run this script directly, this is called
from grab.sh.   run ./grab.sh instead             

this script takes the courses saved in data.json 
and uses functions in db-access.js to save the 
courses to our mongodb instance.
*/

var dbAccess = require('./db-access.js'),
    catalog  = require('./data.json');

if (!catalog) {
  console.log('run grab.sh!  don\'t run this directly!')
} else {
  var start = process.hrtime();
  dbAccess.saveCourseArray(catalog, function(err) {
    if (err) {
      console.log(err)
    } else {
      var precision = 3;
       // divide by a million to get nano to milli
      var elapsed = process.hrtime(start)[1] / 1000000;

      console.log('finished in ' + process.hrtime(start)[0] +
              ' s, ' + elapsed.toFixed(precision) + ' ms - ');
    }
  });
}

