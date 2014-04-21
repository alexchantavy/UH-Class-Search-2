//nowhere near done yet very exploratory!!!!!!!

var mongoose = require('mongoose');

function DataAccessLayer() {
  //CRUD
  


  /* 
    saveCourseArray: saves courses to database.
    @param catalog: an array of courses returned from UHFind.fetchDeptCourses().
  */
  var saveCourseArray = function(catalog, done) {
    if (Array.isArray(catalog)) {
      
      mongoose.connect('mongodb://localhost/uhfind');

      var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));

      db.once('open', function() {
        var courseSchema = mongoose.Schema({
          course: String,
          credits: Number,
          crn: Number,
          genEdFocus: String,
          instructor: String,
          mtgTime: [{
            dates: String,
            days: String,
            loc: String,
            start: String,
            end: String
          }],
          seatsAvail: Number,
          sectionNum: Number,
          title: String
        });
        
        var Course = mongoose.model('Course', this.courseSchema);
        var completed = 0;
        catalog.forEach(function(obj) {
          var tempClass = new Course(obj);

          tempClass.save(function(err, savedClass) {
            if (err) {
              return done(err);
            } else {
              console.log("saved " + savedClass.course);
              completed++;
            }
          });

          if (completed == catalog.length) done();
        });
      });

    } else {
      done('parameter passed is not an array');
    }
  };
}

module.exports = DataAccessLayer;


