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
    'ngSanitize',
    'ngAnimate',
    'mobile-angular-ui',
    'ui.select',
    'ui.bootstrap',
    'monospaced.elastic',
    'angulartics',
    'angulartics.piwik',
    'SwellRTService',
    'hmTouchEvents',
    'ab-base64'
  ]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        redirectTo: '/session/new'
      });
  }])
  .config(function($translateProvider) {
    $translateProvider
      .useStaticFilesLoader({
        prefix: 'l10n/',
        suffix: '.json'
      })
      .useSanitizeValueStrategy('escaped')
      .registerAvailableLanguageKeys(['en', 'es'], {
        'en_*': 'en',
        'es_*': 'es'
       })
      .fallbackLanguage('en')
      .determinePreferredLanguage();
  })
  .filter('base64', function(){
    return window.btoa;
  })
  .filter('escape', function() {
    return window.encodeURIComponent;
  })
  .filter('escapeBase64', function(){
    return function(str){
      return window.encodeURIComponent(
        window.encodeURIComponent(
          window.btoa(str)));
    }
  })
  .filter('unescapeBase64', function(){
    return function(str){
      return window.atob(
        window.decodeURIComponent(
          window.decodeURIComponent(str)));
    }
  });
