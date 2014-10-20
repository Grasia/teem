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
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pascalprecht.translate',
    'mobile-angular-ui',
    'ui.select',
    'ui.bootstrap'
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
