/* Database access module */

var mongoose = require('mongoose'),
    fs       = require('fs'),
    async    = require('async'),
    cfg      = require('../conf/settings.json');

// Defaults
var mongooseOpts = {
    user: cfg.db.username,
    pass: cfg.db.password
};
var databaseName = 'uhfind';

// But if we're in TEST
if (cfg.mode == 'test') {
  mongooseOpts = {
    user: cfg.testdb.username,
    pass: cfg.testdb.password
  };
  databaseName = 'uhfind-test';
}

var courseSchema = mongoose.Schema({
    course:       String,
    credits:      mongoose.Schema.Types.Mixed,
    crn:          Number,
    genEdFocus:   [String],
    instructor:   String,
    mtgTime: [{
      dates:      String,
      days:       [String],
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
  mongoose.connect('mongodb://' + cfg.hostname + '/' + databaseName, mongooseOpts);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function() {
    // sort by objectid descending
    Course.find({}).sort({'_id': -1}).select().exec(function(err, docs) {
      mongoose.disconnect();
      if (err) {
        callback(err);
      } else {
        callback(null, docs);
      } 

    });
  });
}

/*
get:
@param searchOpts query options to pass to mongodb 
@param callback   a callback
Accepts query options for courses, returns results of db query to callback.
*/
function get(searchOpts, callback) {
  /*var validProps = [
    "course",
    "credits",
    "crn",
    "genEdFocus",
    "instructor",
    "mtgTime",
    "dates",
    "days",
    "loc",
    "start",
    "end",
    "seatsAvail",
    "waitListed",
    "waitAvail",
    "sectionNum",
    "title"
  ];*/
  mongoose.connect('mongodb://' + cfg.hostname +'/' + databaseName, mongooseOpts);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  
  db.once('open', function() {
    var query = Course.find();
    for (key in searchOpts) {
      var value = searchOpts[key];
      query.where(key).regex(value);
    }
    query.sort({'_id': -1}).select().exec(function(err, docs) {  
      mongoose.disconnect();
      if (err) {
        callback(err);
      } else { 
        callback(null, docs);
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
      
    mongoose.connect('mongodb://' + cfg.hostname + '/' + databaseName, mongooseOpts);
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
module.exports.get = get;