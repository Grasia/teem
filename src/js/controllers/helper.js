'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:HelperCtrl
 * @description
 * # Helper Ctrl
 * Convinient functions for controllers
 */

angular.module('Pear2Pear')
  .controller('HelperCtrl', [
              '$scope', '$window',
              function($scope, $window){

    $scope.currentHref = function currentHref() {
      return $window.location.href;
    };
  }]);
