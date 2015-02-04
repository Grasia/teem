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

    $scope.userData = function(){
      var tracker = Piwik.getAsyncTracker();
      tracker.setCustomVariable(1,'gender', $scope.user.gender,'visit');
      tracker.setCustomVariable(2,'age', $scope.user.age,'visit');
      tracker.setCustomVariable(3,'role', $scope.user.role,'visit');
      tracker.setCustomVariable(4,'tech', $scope.user.tech,'visit');
      tracker.setCustomVariable(5,'community', $scope.user.community,'visit');
      tracker.storeCustomVariablesInCookie();
      tracker.trackEvent('Session/questionaire', 'answer');
      if (!$route.current.params['redirect']) {
        $location.path('/timeline');
      }
      else {
        var redirect = $route.current.params['redirect'];
        $location.path(redirect);
      }
    };
    
  }]);
