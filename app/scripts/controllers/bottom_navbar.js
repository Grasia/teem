'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:BottomNavbarCtrl
 * @description
 * # BottomNavbarCtrl
 * Controller of the Pear2Pear
 */
angular.module('Pear2Pear')
  .controller('BottomNavbarCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.context = 'news';
    $scope.timeline = function () {
      //TODO timeline of the community
      $location.path('/timeline/');
    };
    $scope.projects = function () {
      //TODO projects of the community
      $location.path('/projects/');
    };
    $scope.tasks = function () {
      //TODO tasks of the user
      $location.path('/my_tasks/:1/tasks/');
    };

    $scope.contextIs = function (ctx) {
      return $location.path().split('/')[1] === ctx;
    };
    
  }]);
