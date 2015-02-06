'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:SessionCtrl
 * @description
 * # SessionCtrl
 * Controller of the Pear2Pear
 */
angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/session/new', {
        templateUrl: 'views/session/new.html',
        controller:'SessionCtrl'
      })
    .when('/session/userdata',{
      templateUrl: 'views/session/userdata.html',
      controller:'SessionCtrl'
    });
  }])

  .controller('SessionCtrl', ['$scope', '$location', '$route', function($scope, $location, $route) {
    $scope.$parent.hideNavigation = true;
    $scope.session = {};

    $scope.create = function() {
      $scope.$parent.hideNavigation = false;
      // $location.path('/timeline');
      $location.path('/session/userdata');
    };

    $scope.userData = function () {
      _paq.push(['appendToTrackingUrl', 'new_visit=1']);
      _paq.push(["deleteCookies"]);
      _paq.push(['setCustomVariable', 1, 'gender', $scope.user.gender, 'visit']);
      _paq.push(['setCustomVariable', 2, 'age', $scope.user.age, 'visit']);
      _paq.push(['setCustomVariable', 3, 'role', $scope.user.role, 'visit']);
      _paq.push(['setCustomVariable', 4, 'tech', $scope.user.tech, 'visit']);
      _paq.push(['setCustomVariable', 5, 'community', $scope.user.community, 'visit']);

      // tracker.storeCustomVariablesInCookie();
      _paq.push(['trackEvent', 'UserQuestionaire', 'answer']);
      _paq.push(['trackPageView']);
      if ($route.current.params['redirect']) {
         var redirect = $route.current.params['redirect'];
        $location.path(redirect);
      }
      else if ($route.current.params['predirect']) {
        window.location.href =  $route.current.params['predirect'];
      }
      else {
        $location.path('/timeline');
      }
    };
    
  }]);
