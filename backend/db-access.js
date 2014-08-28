/* Database access module */

var mongoose = require('mongoose'),
    fs       = require('fs'),
    async    = require('async'),
    cfg      = require('../conf/settings.json');

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
function getAllCourses(useTestDb, callback) {
  var username =     (useTestDb)? cfg.testdb.username : cfg.db.username
  ,   password =     (useTestDb)? cfg.testdb.password : cfg.db.password
  ,   databaseName = (useTestDb)? 'uhfind-test'       : 'uhfind';
  if (useTestDb) {
    console.log("attempting to connect to test db...");
  }
  mongoose.connect('mongodb://' + cfg.hostname + '/' + databaseName, {
    user: username,
    pass: password
  });
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
get: Accepts query options for courses, returns results of db query to 
callback.
Examples:
{genEdFocus:['WI', 'OC']} ->  find all courses that are WI _and_ OC
{course:'ICS'} -> find all 'ICS' courses
{days: 'T', 'R'} -> find all courses that are on Tuesday _or_ Thursday
{credits: 3}
{seatsAvail: true}

@param searchOpts query options to pass to mongodb 
@param callback   a callback

*/
function get(searchOpts, useTestDb, callback) {
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
  var username = (useTestDb)? cfg.testdb.username : cfg.db.username
  ,   password = (useTestDb)? cfg.testdb.password : cfg.db.password
  ,   databaseName = (useTestDb)? 'uhfind-test' : 'uhfind';

  //if (useTestDb) {
    mongoose.set('debug', true);
  //}

  mongoose.connect('mongodb://' + cfg.hostname + '/' + databaseName, {
    user: username,
    pass: password
  });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  
  db.once('open', function() {

    // Query builder.
    var query = Course.find();

    for (var key in searchOpts) {
      var value = searchOpts[key];

      if (key == 'genEdFocus') {

        // db.courses.find({ 
        //   $and: [
        //    { "genEdFocus": /OC/},
        //    { "genEdFocus": /WI/}
        //   ]
        // });

        var genEdFocusList = [];
        for (var i = 0, len = value.length; i < len; i++) {
          genEdFocusList.push( { "genEdFocus" : {'$regex': value[i] } } );
        }
        query.and(genEdFocusList);

      } else if (key == 'days') {

        query.where("mtgTime.days");
        query.in(value);

      } else if (key == 'course') {

        query.where(key);
        query.regex(value);        

      } else if (key == 'credits') {

        // TODO: how the hell do i handle courses with "1.5" credits or 
        // "1-6" credits.  blaaah
        query.where(key);
        query.regex(value);

      } else if (key == 'seatsAvail') {

        if (value == true) {
          query.gt('seatsAvail', 0);
        }
      } else if (key == 'start' ) {
        // Example valid mtgTime.start: '0900'.
        // Example valid mtgTime.end:   '0900a'.  
        query.where("mtgTime.start");
        query.regex(value);

      } else if (key == 'end') {

        query.where("mtgTime.end");
        query.regex(value);

      }

      
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
function saveCourseArray(catalog, useTestDb, callback) {
  if ( ! Array.isArray(catalog)) {
    callback('catalog is not an array');
  } else {
    var username = (useTestDb)? cfg.testdb.username : cfg.db.username
    ,   password = (useTestDb)? cfg.testdb.password : cfg.db.password
    ,   databaseName = (useTestDb)? 'uhfind-test' : 'uhfind';

    mongoose.connect('mongodb://' + cfg.hostname + '/' + databaseName, {
      user: username,
      pass: password
    });

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
          mongoose.disconnect();
          if (err) {
            console.log(err);
          } else {
            console.log('saved to db!');
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