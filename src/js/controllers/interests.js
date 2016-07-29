'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:InterestCtlr
 * @description
 * # InterestCtlr
 * Controller of the Teem
 */

var interests = [{
  name: 'Music',
  logo: '/images/interests/technology.png',
  selected: false
}, {
  name: 'Technology',
  logo: '/images/interests/technology.png',
  selected: false
}, {
  name: 'Travel',
  logo: '/images/interests/technology.png',
  selected: false
}, {
  name: 'Technology',
  logo: '/images/interests/technology.png',
  selected: false
}, {
  name: 'Travel',
  logo: '/images/interests/technology.png',
  selected: false
}, {
  name: 'Technology',
  logo: '/images/interests/technology.png',
  selected: false
}, {
  name: 'Travel',
  logo: '/images/interests/technology.png',
  selected: false
}];


angular.module('Teem')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/interests', {
        controller: 'InterestsCtrl',
        templateUrl: 'interests.html'
      });
  }])
  .controller('InterestsCtrl', [
    'SessionSvc', '$scope', '$location', 'Loading', 'CommunitiesSvc', '$route',
    function(SessionSvc, $scope, $location, Loading, $route) {

      $scope.selected = 0;

      $scope.select = function(interest) {

        if (interest.selected) {
          $scope.selected -= 1;
        } else {
          $scope.selected += 1;
        }

        interest.selected = !interest.selected;
      };

      $scope.displaySelected = function() {
        angular.forEach($scope.interests, function(value, index) {
          if (value.selected) {
            alert(value.name);
          }
        })

        $location.path('/matchmaking');
      };

      function initialize() {
        $scope.interests = interests;
      }


      SessionSvc.onLoad(initialize);

    }
  ]);
