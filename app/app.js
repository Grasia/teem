'use strict';

// Declare app level module which depends on views, and components
var pear2pear = angular.module('Pear2Pear', [
  'ngRoute',
  'Pear2Pear.version',
  'Pear2Pear.session',
  'Pear2Pear.communities',
  'Pear2Pear.tasks',
  'pascalprecht.translate',
  'mobile-angular-ui'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/session/new', {
      templateUrl: 'session/new.html',
      controller:'SessionCtrl'
    }).
    when('/communities', {
      templateUrl: 'communities/index.html',
      controller: 'CommunitiesCtrl'
    }).
    when('/tasks', {
      templateUrl: 'tasks/index.html',
      controller: 'TasksCtrl'
    }).
    when('/tasks/:id', {
      templateUrl: 'tasks/edit.html',
      controller:'EditTaskCtrl'
    }).
    when('/', {
      redirectTo: '/session/new'
    });
}])
.config(function($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: 'l10n/',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('en');
});
