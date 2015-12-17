'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:DateTimeInputCtrl
 * @description
 * # DateTimeInputCtrl
 * Controller of the Teem
 */
angular.module('Teem')
  .controller('DateTimeInputCtrl', ['$scope', function($scope){
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
