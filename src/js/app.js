'use strict';

/**
 * @ngdoc overview
 * @name Teem
 * @description
 * # Teem
 *
 * Main module of the application.
 */
angular
  .module('Teem', [
    'pasvaz.bindonce',
    'pascalprecht.translate',
    'ngRoute',
    'ngSanitize',
    'ngAnimate',
    'ngMessages',
    'ngMaterial',
    'sticky',
    'angulartics',
    'angulartics.piwik',
    'SwellRTService',
    'ab-base64',
    'angular-toArrayFilter',
    'angularMoment',
    'ngclipboard',
    'ngImgCrop',
    'ngFileUpload',
    'infinite-scroll',
    '720kb.socialshare'
  ]).
  // Application config
  // See config.js.sample for examples
  // WARNING: If you check this line, please check the replace
  // string in gulpfile.js
  value('config', {}). // inject:app:config
  config(function($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      // Karma is failing to properly recognize the mocked baseHref
      requireBase: false
    });
  }).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        template: '',
        controller: [
          'SessionSvc', '$location', 'Loading',
          function(SessionSvc, $location, Loading) {
            Loading.show(SessionSvc.onLoad(function() {
              $location.path(SessionSvc.users.loggedIn()? '/home/teems' : '/teems');
            }));
          }
        ]
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
        // When adding more languages, do not forget to add them for "moment"
        // in the vendor.js section of gulpfile.js
      })
      // Do not change order of next two elements
      // https://github.com/angular-translate/angular-translate/issues/920#issuecomment-180550269
      .determinePreferredLanguage()
      .fallbackLanguage('en');
  })
  .config(function ($mdThemingProvider) {
    var customPrimary = {
        '50': '#3fffe0',
        '100': '#26ffdc',
        '200': '#0cffd8',
        '300': '#00f2cb',
        '400': '#00d8b5',
        '500': '#00bfa0',
        '600': '#00a58b',
        '700': '#008c75',
        '800': '#007260',
        '900': '#00594b',
        'A100': '#59ffe4',
        'A200': '#72ffe8',
        'A400': '#8cffec',
        'A700': '#003f35'
    };
    $mdThemingProvider
        .definePalette('customPrimary',
                        customPrimary);
    $mdThemingProvider
        .definePalette('customAccent',
                        customPrimary);

    var customWarn = {
        '50': '#da98ce',
        '100': '#d385c5',
        '200': '#cc72bd',
        '300': '#c65fb4',
        '400': '#bf4dab',
        '500': '#B2409E',
        '600': '#9f398d',
        '700': '#8c337d',
        '800': '#7a2c6c',
        '900': '#67255b',
        'A100': '#e1aad7',
        'A200': '#e7bde0',
        'A400': '#eed0e9',
        'A700': '#541e4b'
    };
    $mdThemingProvider
        .definePalette('customWarn',
                        customWarn);
    $mdThemingProvider.theme('default')
      .primaryPalette('customPrimary', {
        'default': '400', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '100', // use shade 100 for the `md-hue-1` class
        'hue-2': '600', // use shade 600 for the `md-hue-2` class
        'hue-3': 'A100' // use shade A100 for the `md-hue-3` class)
      })
      .accentPalette('customAccent', {
        'default': '400', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '100', // use shade 100 for the `md-hue-1` class
        'hue-2': '600', // use shade 600 for the `md-hue-2` class
        'hue-3': 'A100' // use shade A100 for the `md-hue-3` class)
      });
      //.warningPalette('customwarn');
  })
  .run(function(amMoment, $translate, $window, $rootScope) {
    amMoment.changeLocale($translate.proposedLanguage() || $translate.use());

    angular.element($window).bind('resize', function(){
      $rootScope.$digest();
    });
  })
  .run(function($rootScope, $window, SessionSvc, $mdMedia) {
    $rootScope.loggedIn = function () {
      return SessionSvc.users.loggedIn();
    };
    $rootScope.$mdMedia = $mdMedia;

    $rootScope.isCordova = () => {
      return !! $window.cordova;
    };
  });
