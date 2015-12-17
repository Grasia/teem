'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:HelperCtrl
 * @description
 * # Helper Ctrl
 * Convinient functions for controllers
 */

angular.module('Teem')
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
