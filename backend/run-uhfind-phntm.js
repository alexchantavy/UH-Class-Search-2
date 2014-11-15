/*
Synchronously grabs data from the UH sites and writes it to a json file. 

IMPORTANT: don't run this script directly, meant to be called from
grab.sh.  also, this won't run from node; it'll only
work with phantomjs.

*/

var async   = require('async'),
//remember that phantom's `fs` is NOT node's `fs`.
    fs      = require('fs'),
    UHFind  = require('./uhfind.js');
    uhfind  = new UHFind();

function getClasses(dept, callback) {
  uhfind.fetchDeptCourses(dept, function(err, result) {
    if (err)
      callback(err);
    else
      callback(null, result);  
  });
}

var results = [];

// get data from all departments one at a time.
// any value other than `1` will make phantomjs fail.
var MAX_CONCURRENT = 1;

// async library is used to keep the requests all in order. seems like we can
// only handle one at a time. 
async.eachLimit(
  uhfind.departments,
  MAX_CONCURRENT,

  // do this for each department
  function(dept, callback) {
    getClasses( dept, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        // concatenate data without producing new array
        results.push.apply(results, data);
      }
      callback();
    });
  }, 

  // whole job is done
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('done with ' + results.length + ' classes!');
      // 'w' is overwrite.
      fs.write('data.json', JSON.stringify(results), 'w');
      console.log('Wrote data.json!');
      phantom.exit();
    }
  }

);

