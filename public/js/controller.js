// controller.js
var uhfind = angular.module('uhfind', ['infinite-scroll']);


uhfind.controller('uhfindCtrl', function($scope, $http) {

  var ADD_AMOUNT = 16;
  $scope.from = 32;

  $scope.orderProp = 'course';
  $scope.courses = [];
  $scope.download = [];

  $http.get('courses.json')
      .success(function(data) { 
        $scope.download = data;

        //just push first 32 classes
        for (var i = 0; i < 32; i++) {
          $scope.courses.push($scope.download[i]);
        }
      });


  $scope.loadMore = function() {
    for (var i = 0; 
         i < ADD_AMOUNT && i + $scope.from < $scope.download.length; 
         i++) {

        $scope.courses.push( $scope.download[ i + $scope.from ]);
      
    }
    $scope.from = $scope.courses.length;
  };
});


/*
var myApp = angular.module('myApp', ['infinite-scroll']);
myApp.controller('DemoController', function($scope) {
  $scope.images = [1, 2, 3, 4, 5, 6, 7, 8];

  $scope.loadMore = function() {
    var last = $scope.images[$scope.images.length - 1];
    for(var i = 1; i <= 8; i++) {
      $scope.images.push(last + i);
    }
  };
});
*/









/*


var uhfind = angular.module('uhfind', ['infinite-scroll']);

uhfind.controller('uhfindCtrl', function($scope, Scroller) {
  $scope.scroller = new Scroller();
  $scope.orderProp = 'course';
});


// Reddit constructor function to encapsulate HTTP and pagination logic
uhfind.factory('Scroller', function($http) {
  var Scroller = function() {
    this.courses = [];
    this.busy = false;
    this.cursor = 8;
  };

  Scroller.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;

    $http.get('courses.json?cursor='+this.cursor).success(function(data) {
      var tempItems = data;
      for (var i = 0; i < tempItems.length; i++) {
        this.courses.push(tempItems[i]);
      }
      this.cursor += this.items.length;
      this.busy = false;
    }.bind(this));
  };

  return Scroller;
});*/