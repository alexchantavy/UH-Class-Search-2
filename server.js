#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var stylus  = require('stylus');
var app = express();
var Api = require('./backend/data-provider.js').API;

// Set up the DB
var api = new Api(process.env.OPENSHIFT_MONGODB_DB_HOST,
                  parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT),
                  process.env.OPENSHIFT_MONGODB_DB_USERNAME,
                  process.env.OPENSHIFT_MONGODB_DB_PASSWORD);


// standard expressjs config, only thing different is that it 
// references OPENSHIFT_REPO_DIR.
app.configure(function() {
  app.set('views', process.env.OPENSHIFT_REPO_DIR + 'views');
  app.set('view engine', 'jade');
  app.set('view options', { pretty :true});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(app.router);
  app.use(stylus.middleware({
      src:  process.env.OPENSHIFT_REPO_DIR + 'views'
    , dest: process.env.OPENSHIFT_REPO_DIR + 'public'
    , compile: function(str, path) {
      return stylus(str)
        .set('filename', path)
        .set('warn', true)
        .set('compress', true);
    }
  }));
  app.use(express.static(process.env.OPENSHIFT_REPO_DIR + 'public'));
});


// set up the routes
app.get('/', function(req, res) {
  res.render('index', {layout: 'layout', title: 'Herp'});
});
app.get('/ics', function(req, res) {
  api.findByDepartment('ICS', function(error, docs) {
    if (error) {console.log(error); } 
    else {
      res.send(docs);
    }
  });
});


// env vars
var ipaddr = process.env.OPENSHIFT_NODEJS_IP;
var port   = process.env.OPENSHIFT_NODEJS_PORT || 8080;

if (typeof ipaddr === 'undefined') {
  console.warn('No OPENSHIFT_NODEJS_IP env var');
}

// terminator === the termination handler
function terminator(sig) {
  if (typeof sig === 'string') {
    console.log('%s: received %s - terminating node server ...',
                Date(Date.now()), sig);
    process.exit(1);
  }
  console.log('%s: Node server stopped.', Date(Date.now()));
}

// process on exit and signals
process.on('exit', function() { terminator(); });

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 
 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'
].forEach(function(element, index, array) {
  process.on(element, function() { terminator(element); });
}); 

// start app on interface and port
app.listen(port, ipaddr, function() {
  console.log('%s: Node server started on %s:%d ...', Date(Date.now() ),
              ipaddr, port);
});
