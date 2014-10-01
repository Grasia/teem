'use strict';

// Declare app level module which depends on views, and components
var pear2pear = angular.module('Pear2Pear', [
  'ngRoute',
  'tasks',
  'pascalprecht.translate',
  'Pear2Pear.version',
  'mobile-angular-ui'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/tasks/:id', {
            templateUrl: 'tasks/editTask.html',
            controller:'EditTaskCtrl'
        }).
        when('/tasks', {
            templateUrl: 'tasks/tasks.html',
            controller: 'TasksCtrl'
        })
        .otherwise({redirectTo: '/'});
}])
.config(function($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: 'l10n/',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('en');
});
