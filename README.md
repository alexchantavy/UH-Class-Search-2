uh-class-search-2
=================

Graduate faster with this UH class searcher. 

Uses phantomjs for screen scraping.


# Usage

```javascript
var UHFind = require('./uhfind.js');
var uhfind = new UHFind();

//retrieve and print all ICS courses from UH catalog
uhfind.fetchDeptCourses('ICS', function(res){
	console.log(JSON.stringify(res, undefined, 2));
});
```


# How to run tests

```shell
$> phantomjs test/run-tests.js
```