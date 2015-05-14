'use strict';

/**
 * @ngdoc overview
 * @name Pear2Pear
 * @description
 * # Pear2Pear
 *
 * Main module of the application.
 */
angular
  .module('Pear2Pear', [
    'pasvaz.bindonce',
    'pascalprecht.translate',
    'ngRoute',
    'mobile-angular-ui',
    'ui.select',
    'ui.bootstrap',
    'angulartics',
    'angulartics.piwik'
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
  
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.preferredLanguage('en');
  });
