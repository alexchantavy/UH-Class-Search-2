// Set up our DB API globals.
var Db         = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server     = require('mongodb').Server;
var BSON       = require('mongodb').BSON;
var ObjectID   = require('mongodb').ObjectID;

// Main DB provider object
API = function(host, port, user, pass) {
  this.db = new Db(process.env.OPENSHIFT_APP_NAME, new Server(host, port, { auto_reconnect: true }, {}));
  this.db.open(function(error, db) {
    db.authenticate(user, pass, function(error, result) {});
  });
};

// This gets us in to the 'classes' collection
API.prototype.getClasses = function(callback) {
  this.db.collection('classes', function(error, classes_collection) {
    if (error) {
      callback(error);
    }
    else {
      callback(null, classes_collection);
    }
  });
};



// Grab all of the classes for a given department.
// This also explicitly orders the records by market name.
API.prototype.findByDepartment = function(dept, callback) {
  this.getClasses(function(error, class_collection) {
    if (error) {
        callback(error);
    }
    else {
      var cursor = class_collection.find({ 'dept': dept });
      cursor.sort({ 'course': 1 });
      cursor.toArray(function(error, result) {
        if (error) {
          callback(error);
        }
        else {
          callback(null, result);
        }
      });
    }
  });
};

// [could probably use this later] 
//Grab all of the distinct department names
// We use this to populate the UI state select list.
/*API.prototype.allStates = function(callback) {
  this.getClasses(function(error, location_collection) {
    if (error) {
        callback(error);
    }
    else {
      location_collection.distinct('LocAddState', function(error, result) {
        if (error) {
            callback(error);
        }
        else {
            callback(null, result);
        }
      });
    }
  });
};*/

// Write the suppiled records into the database.
// This is for new records only, not "upserts"
API.prototype.saveClasses = function(course, callback) {
  this.getClasses(function(error, class_collection) {
    if (error) {
        callback(error);
    }
    else {
      class_collection.insert(course, function(error, result) {
        if (error) {
          callback(error);
        }
        else {
          callback(null, result);
        }
      });
    }
  });
};

// Not really needed
// Update the indicated farmstand record with Lat/Lon data.
/*API.prototype.setLocGeo = function(locGeo, callback) {
    this.getClasses(function(error, location_collection) {
  if (error) {
      callback(error);
  }
  else {
      var oid = new ObjectID(locGeo.id);
      location_collection.update({ _id: oid }, { $set: { 'LocLat': locGeo.lat, 'LocLon': locGeo.lon }}, {}, function(error, result) {
    if (error) {
        callback(error);
    }
    else {
        callback(null, result);
    }
      });
  }
    });
};*/

// (not really needed)
// Get the previously stored state geolocation data.
/*API.prototype.allStateGeo = function(callback) {
  this.getStateGeos(function(error, state_geocode_collection) {
    if (error) {
      callback(error);
    }
    else {
      var cursor = state_geocode_collection.find({});
      cursor.toArray(function(error, result) {
        if (error) {
          callback(error);
        }
        else {
          callback(null, result);
        }
      });
    }
  });
};*/

/*Could use later
// Write the suppiled records into the database.
API.prototype.setStateGeo = function(state, callback) {
    this.getStateGeos(function(error, state_geocode_collection) {
  if (error) {
      callback(error);
  }
  else {
      state_geocode_collection.insert(state, function(error, result) {
    if (error) {
        callback(error);
    }
    else {
        callback(null, result);
    }
      });
  }
    });
};
*/
// Export the DB provider for use in other modules.
exports.API = API;