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
        template: '',
        controller: 'FrontpageCtrl'
      }).
      when('/walkthrough', {
        templateUrl: 'walkthrough.html',
        controller: 'WalkthroughCtrl'
      });
  }])

  .controller('FrontpageCtrl', [
    'SessionSvc', '$location', '$cookies', 'Loading',
    function(SessionSvc, $location, $cookies, Loading) {

      if ($cookies.get('walkthrough')) {
        Loading.show(SessionSvc.onLoad(function() {
          $location.path(SessionSvc.users.loggedIn()? '/home/teems' : '/communities');
        }));
      } else {
        $location.path('/walkthrough');
      }
  }])
  .controller('WalkthroughCtrl', [
    '$rootScope', '$scope', '$location', '$timeout', '$cookies',
    function($rootScope, $scope, $location, $timeout, $cookies) {

      $rootScope.hideNavigation = true;

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
