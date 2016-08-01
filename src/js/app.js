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
    'mobile-angular-ui',
    'ui-notification',
    'selectize',
    'ui.bootstrap',
    'angulartics',
    'angulartics.piwik',
    'SwellRTService',
    'hmTouchEvents',
    'ab-base64',
    'angular-toArrayFilter',
    'angularMoment',
    'ngclipboard',
    'ngImgCrop',
    'ngFileUpload',
    'flock.bootstrap.material'
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
              $location.path(SessionSvc.users.loggedIn()? '/home/teems' : '/communities');
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
  .run(function(amMoment, $translate, $window, $rootScope) {
    amMoment.changeLocale($translate.proposedLanguage() || $translate.use());

    angular.element($window).bind('resize', function(){
      $rootScope.$digest();
    });
  })
  .run(function($rootScope, $window, SessionSvc) {
    $rootScope.loggedIn = function () {
      return SessionSvc.users.loggedIn();
    };
    $rootScope.isDesktop = function() {
      return $window.innerWidth >= 992;
    };
  });
