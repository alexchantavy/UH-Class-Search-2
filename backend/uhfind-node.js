//uh-find-node.js

var request = require('request'),
    trumpet = require('trumpet')();
var r = request.get('https://www.sis.hawaii.edu/uhdad/avail.classes?i=MAN&t=201510&s=ICS');
    trumpet.selectAll('tr', function (tr) {
      tr.createReadStream().pipe(process.stdout);
    });
r.pipe(trumpet);