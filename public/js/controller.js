// controller.js

var uhfind = angular.module('uhfind', []);

uhfind.controller('uhfindCtrl', function($scope, $http) {
  $http.get('courses.json').success(function(data) {
    $scope.courses = data;
  });
 
  $scope.orderProp = 'course';
});