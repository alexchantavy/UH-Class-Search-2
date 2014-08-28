var express  = require('express'),
	  app      = express(),
    morgan   = require('morgan'),
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
var format = ':remote-addr - [:date] ":method :url" :status ":referrer" ":user-agent" :response-time ms';
app.use(morgan(format));



app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.get('/api/courses.json', api.courses);
app.get('/api/search', api.search);
app.get('/about', function(req, res) {
  res.render('about');
});
app.get('/donations', function(req, res) {
  res.render('donations');
});

app.listen(5000, function(req, res) {
  console.log('listening on 5000');
});
