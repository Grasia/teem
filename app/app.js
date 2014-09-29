'use strict';

// Declare app level module which depends on views, and components
angular.module('Pear2Pear', [
  'ngRoute',
  'Pear2Pear.version',
  'mobile-angular-ui'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
