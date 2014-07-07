uh-class-search-2
=================

Graduate faster with this UH class searcher. 

1. Screen scrapes UH class page with phantomjs
2. Stores results in local MongoDB instance
3. Displays interface with AngularJs.

# License 
Creative Commons Attribution Non-Commercial

https://tldrlegal.com/license/creative-commons-attribution-noncommercial-(cc-nc)#fulltext

# Install Requirements
1. Locally running MongoDB instance
2. PhantomJs 

# Rough Installation Guide
Run these steps if you want to install this app on your own VPS/local machine.  Fine tune it for your specific MongoDB password and config.
```shell
git clone https://github.com/alexchantavy/UH-Class-Search-2.git
npm install 
# Run the scrape task, populate the MongoDB instance
cd backend && ./grab.sh
cd .. && node app
```

# Scraping the UH Manoa course catalog:

```javascript
var UHFind = require('./backend/uhfind.js');
var uhfind = new UHFind();

//retrieve and print all ICS courses from UH catalog
uhfind.fetchDeptCourses('ICS', function(err, res){
	console.log(JSON.stringify(res, undefined, 2));
});
```

# How to run tests
```shell
$> npm test
```



