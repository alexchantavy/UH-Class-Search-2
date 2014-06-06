uh-class-search-2
=================

Graduate faster with this UH class searcher. 

1. Screen scrapes UH class page with phantomjs
2. Stores results in local MongoDB instance
3. Displays interface with AngularJs.


# License 
Creative Commons Attribution Non-Commercial

https://tldrlegal.com/license/creative-commons-attribution-noncommercial-(cc-nc)#fulltext

# Usage

```javascript
var UHFind = require('./uhfind.js');
var uhfind = new UHFind();

//retrieve and print all ICS courses from UH catalog

// I think that's the method, I obv need to update the docs
uhfind.fetchDeptCourses('ICS', function(res){
	console.log(JSON.stringify(res, undefined, 2));
});
```


# How to run tests
TBH These are not really worth anything yet, I gotta fix this.
```shell
$> phantomjs test/run-tests.js
```
