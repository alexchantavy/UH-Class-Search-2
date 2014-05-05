// controller.js
var uhfind = angular.module('uhfind', ['ngGrid']);


uhfind.controller('uhfindCtrl', function($scope, $http) {
  $scope.courses = [];
  $http.get('api/courses.json').success(function(data) { 
    $scope.courses = data;
  });

  var filterBarPlugin = {
    init: function(scope, grid) {
      filterBarPlugin.scope = scope;
      filterBarPlugin.grid = grid;

      $scope.$watch(function() { 
      //watch expression
        var searchQuery = '';    
        angular.forEach(filterBarPlugin.scope.columns, function(col) {
          if (col.visible && col.filterText) {
            var filterText = (col.filterText.indexOf('*') == 0 ? col.filterText.replace('*', '') : "^" + col.filterText) + ";";
            searchQuery += col.displayName + ": " + filterText;
          }
        });
        return searchQuery;
      }, function(searchQuery) { 
      //listener
        filterBarPlugin.scope.$parent.filterText = searchQuery;
        filterBarPlugin.grid.searchProvider.evalFilter();
      });
    },
    scope: undefined,
    grid: undefined
  };

  angular.forEach($scope.courses, function(row) {
    row.concatTime = function() {
      return this.mtgTime[0].loc + ': ' + this.mtgTime[0].days + ' -- ' + this.mtgTime[0].start + '-' + this.mtgTime[0].end;
    };
  });


  var colDefs = [
    {field: 'course', displayName: 'Course', headerCellTemplate: 'partials/filterHead'},
    {field: 'title', displayName: 'Title', headerCellTemplate: 'partials/filterHead', width: '20%'},
    {field: 'credits', displayName: 'Credits', headerCellTemplate: 'partials/filterHead'},
    {field: 'genEdFocus', displayName: 'Reqs Met', headerCellTemplate: 'partials/filterHead'},
    {field: 'mtgTime[0].loc', displayName: 'Location1', headerCellTemplate: 'partials/filterHead'},
    {field: 'mtgTime[0].days', displayName: 'Days', headerCellTemplate: 'partials/filterHead'},
    {field: 'mtgTime[0].start', displayName: 'Start1', headerCellTemplate: 'partials/filterHead'},
    {field: 'mtgTime[0].end', displayName: 'End1', headerCellTemplate: 'partials/filterHead'},
    {field: 'instructor', displayName: 'Instructor', headerCellTemplate: 'partials/filterHead'},
    {field: 'seatsAvail', displayName: 'Seats Avail', headerCellTemplate: 'partials/filterHead'},
   // {field: 'waitAvail', displayName: 'Wait Avail', headerCellTemplate: 'partials/filterHead'},
   // {field: 'waitListed', displayName: 'Wait List', headerCellTemplate: 'partials/filterHead'},
    {field: 'crn', displayName: 'CRN', headerCellTemplate: 'partials/filterHead'},
    {field: 'sectionNum', displayName: 'Sect.', width: '5%'} //headerCellTemplate: 'partials/filterHead'},

  ];




  $scope.ngGridOptions = { 
    data: 'courses',
    columnDefs: colDefs,
    plugins: [filterBarPlugin],
    //give room for filter bar
    headerRowHeight: 60 
  };
});