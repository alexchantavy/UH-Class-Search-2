// controller.js
var uhfind = angular.module('uhfind', ['ngTable']);

uhfind.controller('uhfindCtrl', function($scope, $http, $filter, ngTableParams) {

  $scope.lastUpdated;
  var data = [];

  $scope.orderInstructorsBy = function(course) {
    return course.instructor.substring(2);
  }

  $scope.tableParams = new ngTableParams({
      page: 1,
      count: 10,
      filter: {},
      sorting: { 
        course: 'asc'
      }
    }, {
      total: data.length,
      getData: function($defer, params) {
        $http.get('api/courses.json')
        .success(function(data) { 

          var m = dateFromObjectId(data[0]._id);

          // pad minutes-field with leading zero
          var minutes = (m.getUTCMinutes() < 10)? '0' + m.getUTCMinutes() 
                                                :      m.getUTCMinutes();

          var seconds = (m.getUTCSeconds() < 10)? '0' + m.getUTCSeconds() 
                                                :      m.getUTCSeconds();

          $scope.lastUpdated = m.getUTCFullYear() + "/" + 
            (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + 
             m.getUTCHours() + ":" + minutes + ":" + seconds;

          // use built-in angular filter
          var filteredData = params.filter() ?
              $filter('filter')(data, params.filter()) :
              data;

          var orderedData = params.sorting() ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              data;

          params.total(data.length);
          $defer.resolve(orderedData.slice((params.page() -1) * params.count()
                        , params.page() * params.count()));

        });
      }
    });
});

function dateFromObjectId (objectId) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};
