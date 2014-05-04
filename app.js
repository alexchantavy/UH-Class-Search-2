var express  = require('express'),
	  app      = express(),
    stylus   = require('stylus'),
    nib      = require('nib'),
    routes   = require('./routes'),
    api      = require('./routes/api');


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;

var stylusOpts = { src: __dirname + '/public', 
  compile: function(str, path) {
    return stylus(str).set('filename', path).use(nib());
  }
};
app.use(stylus.middleware(stylusOpts));

app.use(express.static(__dirname + '/public'))
app.use(express.logger('dev'));



app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.get('/api/courses.json', api.courses);


app.listen(3000, function(req, res) {
  console.log('listening on 3000');
});