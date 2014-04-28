var express  = require('express'),
	  app      = express(),
    stylus   = require('stylus'),
    nib      = require('nib'),
    dbAccess = require('./backend/db-access.js');


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
app.use(express.logger('dev'));
app.use(stylus.middleware({ 
          src: __dirname + '/public', 
          compile: function(str, path) {
                     return stylus(str)
                     .set('filename', path)
                     .use(nib());
                   }    
}));
app.use(express.static(__dirname + '/public'))


app.get('/courses.json', function(req, res) {
  dbAccess.getAllCourses(function(err, docs) {
    if (err) {
      res.json();
    } else {
      res.json(docs);
    }
  });  
});

app.get('/', function(req, res) {
  res.render('index', 
    { title : 'Home' }
  );
});


app.listen(3000, function(req, res) {
  console.log('listening on 3000');
});