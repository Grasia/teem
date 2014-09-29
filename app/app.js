'use strict';

// Declare app level module which depends on views, and components
var pear2pear = angular.module('Pear2Pear', [
  'ngRoute',
  'Pear2Pear.version',
  'tasks'
]).
config(['$routeProvider', function($routeProvider) {
 $routeProvider.
      when('/tasks', {
        templateUrl: 'tasks/tasks.html',
        controller: 'TasksCtrl'
      }).otherwise({redirectTo: '/'});
}]);
