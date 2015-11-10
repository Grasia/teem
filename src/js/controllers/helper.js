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

    $scope.linkCurrentProject = function linkCurrentProject() {
      var hash = $window.location.hash.substr(1);
      return $window.location.protocol + '//' + $window.location.host + '#/?redirect=' + hash;
    };
  }]);
