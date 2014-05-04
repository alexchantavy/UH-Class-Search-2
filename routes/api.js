var dbAccess = require('../backend/db-access.js');

module.exports.courses = function(req, res) {
  dbAccess.getAllCourses(function(err, docs) {
    if (err) {
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