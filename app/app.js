'use strict';

// Declare app level module which depends on views, and components
var pear2pear = angular.module('Pear2Pear', [
  'ngRoute',
  'Pear2Pear.version',
  'Pear2Pear.session',
  'tasks',
  'pascalprecht.translate',
  'mobile-angular-ui'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/session/new', {
      templateUrl: 'session/new.html',
      controller:'SessionCtrl'
    }).
    when('/tasks/:id', {
      templateUrl: 'tasks/edit.html',
      controller:'EditTaskCtrl'
    }).
    when('/tasks', {
      templateUrl: 'tasks/index.html',
      controller: 'TasksCtrl'
    })
    .otherwise({redirectTo: '/session/new'});
}])
.config(function($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: 'l10n/',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('en');
});
