'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:DateTimeInputCtrl
 * @description
 * # DateTimeInputCtrl
 * Controller of the Pear2Pear
 */
angular.module('Pear2Pear')
  .controller('DateTimeInputCtrl', ['$scope', '$timeout', function($scope,$timeout){
    $scope.open = function() {
      $timeout(function() {
        $scope.opened = true;
      });
    };
  }]);
