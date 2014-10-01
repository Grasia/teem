'use strict';

// Declare app level module which depends on views, and components
var pear2pear = angular.module('Pear2Pear', [
  'ngRoute',
  'Pear2Pear.version',
  'Pear2Pear.session',
  'Pear2Pear.communities',
  'Pear2Pear.tasks',
  'pascalprecht.translate',
  'mobile-angular-ui',
  'ui.select'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
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
