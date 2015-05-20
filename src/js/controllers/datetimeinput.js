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
    $scope.supportsDateInput = Modernizr.inputtypes.date;
    $scope.supportsTimeInput = Modernizr.inputtypes.time;
    $scope.model={};
    $scope.open = function($event,elementOpened) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.model[elementOpened] = !$scope.model[elementOpened];
    };
    $scope.datetimeEditing = true;
  }]);
