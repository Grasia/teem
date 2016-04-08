'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:WalkthroughCtrl
 * @description
 * # WalkthroughCtrl
 * Landing page
 */
angular.module('Teem')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/walkthrough', {
        templateUrl: 'walkthrough.html',
        controller: 'WalkthroughCtrl'
      });
  }])
  .controller('WalkthroughCtrl', [
    '$rootScope', '$scope', '$rootElement', '$location', '$timeout', '$cookies',
    function($rootScope, $scope, $rootElement, $location, $timeout, $cookies) {

      $rootScope.hideNavigation = true;
      $rootElement.removeClass('has-navbar-top');

      $scope.$on('$destroy', function() {
        $rootElement.addClass('has-navbar-top');
        $rootScope.hideNavigation = false;
      });

      $timeout(function() {
        new Swiper('.swiper-container', {
          autoplay: 7000,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          pagination: '.swiper-pagination',
          paginationHide: false,
          paginationClickable: true,
          autoplayStopOnLast: true,
          mousewheelControl: true
        });
      });

      $scope.close = function() {
        var expires = 'Tue, 19 Jan 2038 03:14:07 UTC'; // https://en.wikipedia.org/wiki/Year_2038_problem
        $cookies.put('walkthrough', 'true', {expires});
        $location.path('/communities');
      };
    }]);
