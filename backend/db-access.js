/* Database access module */

var mongoose = require('mongoose'),
    fs       = require('fs'),
    async    = require('async');

var courseSchema = mongoose.Schema({
    course:       String,
    credits:      mongoose.Schema.Types.Mixed,
    crn:          Number,
    genEdFocus:   String,
    instructor:   String,
    mtgTime: [{
      dates:      String,
      days:       String,
      loc:        String,
      start:      String,
      end:        String
    }],
    seatsAvail:   Number,
    waitListed:   Number,
    waitAvail:    Number,
    sectionNum:   Number,
    title:        String
});

var Course = mongoose.model('Course', courseSchema);

/* 
  getAllCourses: retrieves records of all courses from the database.
  @param callback: run this after we have saved everything
*/
function getAllCourses(callback) {
  mongoose.connect('mongodb://localhost/uhfind');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function() {
    Course.find({}, null, null, function(err, docs) {
      if (err) {
        callback(err);
      } else {
        callback(null, docs);
        mongoose.disconnect();
      } 
    });
  });
}


/* 
  saveCourseArray: upserts courses to database.
  @param catalog: an array of courses returned from UHFind.fetchDeptCourses().
  @param callback: run this after we have saved everything
*/
function saveCourseArray(catalog, callback) {
  if ( ! Array.isArray(catalog)) {
    callback('catalog is not an array');
  } else {
      
    mongoose.connect('mongodb://localhost/uhfind');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function() {
      
      // seems to be a sweet spot for performance 
      var MAX_CONCURRENT = 160;

      async.eachLimit(catalog, MAX_CONCURRENT,
        // Upsert items
        function(item, callback) {
          // if item is in db with same crn, update all fields.
          Course.update(
            { crn: item.crn }, 
            item, 
            { multi: false, upsert: true },
            function(err, numAffected, raw) {
              if (err) {
                callback(err);
              } else {
                console.log('saved course ' + item.course);
                callback();
              }
            }
          );
        },

        // done with all items
        function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('saved to db!');
            mongoose.disconnect();
            callback();
          }
        }
      );

    });
  }
}

module.exports.getAllCourses = getAllCourses;
module.exports.saveCourseArray = saveCourseArray;