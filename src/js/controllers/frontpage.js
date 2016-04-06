'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:FrontpageCtrl
 * @description
 * # FrontpageCtrl
 * Landing page
 */
angular.module('Teem')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/frontpage', {
        templateUrl: 'frontpage.html',
        controller:'FrontpageCtrl'
      });
  }])

  .controller('FrontpageCtrl', [
    '$rootScope', '$scope', '$rootElement', 'SessionSvc', '$location',
    function($rootScope, $scope, $rootElement, SessionSvc, $location) {
      $rootScope.hideNavigation = true;
      $rootElement.removeClass('has-navbar-top');

      $scope.$on('$destroy', function() {
        $rootElement.addClass('has-navbar-top');
        $rootScope.hideNavigation = false;
      });

      new Swiper('.swiper-container', {
        autoplay: 5000,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
      });

      if (SessionSvc.users.loggedIn()) {
        $rootElement.addClass('has-navbar-top');
        $rootScope.hideNavigation = false;

        $location.path('/teems');
      }
    }]);
