// controller.js
var uhfind = angular.module('uhfind', ['ngTable']);

uhfind.controller('uhfindCtrl', function($scope, $http, $filter, ngTableParams) {

  $scope.lastUpdated;
  $scope.data = [];

  $http.get('api/courses.json').success(function(result) { 
    $scope.data = result;
  });
});

// var m = dateFromObjectId(data[0]._id);

// // pad minutes-field with leading zero
// var minutes = (m.getUTCMinutes() < 10)? '0' + m.getUTCMinutes() 
//                                       :      m.getUTCMinutes();

// var seconds = (m.getUTCSeconds() < 10)? '0' + m.getUTCSeconds() 
//                                       :      m.getUTCSeconds();

// $scope.lastUpdated = m.getUTCFullYear() + "/" + 
//   (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + 
//    m.getUTCHours() + ":" + minutes + ":" + seconds;
 

function dateFromObjectId (objectId) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};
