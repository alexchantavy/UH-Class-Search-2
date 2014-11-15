uh-class-search-2
=================

Graduate faster with this UH class searcher.  Live online [here](http://uhfind.alexchantavy.com).

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

First create conf/settings.json.  It should look something like this:
```json
{
  "hostname": "[your-mongo-db-hostname]",
  "db": {
    "username": "YourMongoDbUsername",
    "password": "YourMongoDbPassword",
    "database": "TheDatabaseNameWhereYouWantToSaveThisData"
  },
  "testdb": {
    "username": "Same As",
    "password": "Above Except",
    "database": "This Is If You Want A Test DB"
  },
  "mode": "put 'prod' here for production or 'test' here for testing",
}
```

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



