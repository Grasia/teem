'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:SessionCtrl
 * @description
 * # SessionCtrl
 * Controller of the Pear2Pear
 */
angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/session/new', {
        templateUrl: 'views/session/new.html',
        controller:'SessionCtrl'        
      });
  }])

  .controller('SessionCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.$parent.hideNavigation = true;
    $scope.create = function() {
      $scope.$parent.hideNavigation = false;
      $location.path('/timeline');
    };
  }]);
