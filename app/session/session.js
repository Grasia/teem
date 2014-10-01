'use strict';

angular.module('Pear2Pear.session', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/session/new', {
      templateUrl: 'session/new.html',
      controller:'SessionCtrl'
    });
}])

.controller('SessionCtrl', ['$scope', '$location', function($scope, $location) {
}]);
