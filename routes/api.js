var dbAccess = require('../backend/db-access.js');

module.exports.courses = function(req, res) {
  dbAccess.getAllCourses(false, function(err, docs) {
    if (err) {
      console.log(JSON.stringify(err, undefined, 2));
      res.send('error!');
    } else {
      // send docs up to index `cursor`
      var from = req.query.from;
      var to = req.query.to

      if (from
          && !to
          && from < docs.length 
          && from >= 0) {

        res.json(docs.slice(from));

      } else if (from 
               && to 
               && from < docs.length 
               && to < docs.length
               && from >= 0 
               && to > 0) {

        res.json(docs.slice(from, to))

      } else {
        res.json(docs);
      }

    }
  });    
};


/**
 *  List of possible GET params:
 *  genEdFocus
 *  course
 *  credits
 *  days
 *  start
 *  end
 *  seatsAvail 
 **/
module.exports.search = function(req, res) {
  // build our options object from the get params

  var opts = {};
  if (req.query.genEdFocus != null && req.query.genEdFocus != '') {
    opts.genEdFocus = req.query.genEdFocus;
  }
  if (req.query.course != null && req.query.course != '') {
    opts.course = req.query.course;
  }
  if (req.query.credits != null && req.query.credits != '') {
    opts.credits = req.query.credits;
  }
  if (req.query.days != null && req.query.days != '') {
    opts.days = req.query.days;
  }
  if (req.query.start != null && req.query.start != '') {
    opts.start = req.query.start;
  }
  if (req.query.end != null && req.query.end != '') {
    opts.end = req.query.end;
  }
  if (req.query.seatsAvail != null && req.query.seatsAvail != '') {
    opts.seatsAvail = req.query.seatsAvail;
  }
  console.log(opts);
  // run the query
  dbAccess.get(opts, false, function(err, docs) {
    if (err) {
      console.log('ho someting wen break.');
      console.log(err);
    } else {
      res.json(docs);
    }
  });
};