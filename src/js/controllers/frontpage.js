'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:FrontpageCtrl
 * @description
 * # FrontpageCtrl
 * Landing page
 */
angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/frontpage', {
        templateUrl: 'frontpage.html',
        controller:'FrontpageCtrl'
    });
  }])

  .controller('FrontpageCtrl', [
    '$rootScope', '$scope', '$rootElement',
    function($rootScope, $scope, $rootElement) {
      $rootScope.hideNavigation = true;
      $rootElement.removeClass('has-navbar-top');

      $scope.$on('$destroy', function() {
        $rootElement.addClass('has-navbar-top');
        $rootScope.hideNavigation = false;
      });

      var slide = new Swiper('.swiper-container', {
        autoplay: 5000,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
      });
  }]);
