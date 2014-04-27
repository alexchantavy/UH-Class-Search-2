//nowhere near done yet very exploratory!!!!!!!

var mongoose = require('mongoose'),
    fs       = require('fs'),
    async    = require('async'),
    catalog  = require('./data.json');


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

/* 
  saveCourseArray: saves courses to database.
  @param catalog: an array of courses returned from UHFind.fetchDeptCourses().
*/
var saveCourseArray = function(catalog, callback) {
  if ( ! Array.isArray(catalog)) {
    callback('catalog is not an array');
  } else {
      
    mongoose.connect('mongodb://localhost/uhfind');

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function() {
      
      var Course         = mongoose.model('Course', courseSchema);
      var MAX_CONCURRENT = 5;
      var updateOpts     = { multi: false, update: true };

      async.eachLimit(catalog, MAX_CONCURRENT,

        // upsert each of them
        function(item, callback) {

          var currentCourse = new Course(item);
          currentCourse.save(function(err) {
            if (err) {
              console.log(err)
            } else {
              console.log('saved course ' + item.course);
            }
            callback();
          });

          /* //TODO: figure out how to `upsert`.
          Course.update({ crn: item.crn }, item, updateOpts,
            function(err, numAffected, raw) {
              if (err) {
                callback(err);
              } else {
                console.log('saved course ' + item.course);
                callback();
              }
            }
          );*/

        },

        // done
        function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('saved to db!');
            mongoose.disconnect();
          }
        }
      );

    });
  }
};

saveCourseArray(catalog, function(err) {
  if (err) 
    console.log(err)
  else
    console.log('success!');
});


