'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:SessionCtrl
 * @description
 * # SessionCtrl
 * Controller of the Teem
 */
angular.module('Teem')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/session/new', {
        templateUrl: 'session/new.html',
        controller:'SessionCtrl'
      });
  }])
  .controller('SessionCtrl', [
    '$scope', '$location', '$route', 'SessionSvc', '$timeout', 'SharedState',
    function($scope, $location, $route, SessionSvc, $timeout, SharedState) {
    $scope.session = {};

    $scope.loginRegexp = new RegExp('^[a-zA-Z0-9\.]+$');

    $scope.user = {
      nick : ''
    };

    $scope.login = function() {
      var startSession = function(){
        // TODO change password when register is available
        SessionSvc.startSession(
          $scope.user.nick, SessionSvc.users.password,
          function(){
            $timeout(function(){
              SharedState.turnOff('shouldLoginSharedState');
            });
          },
          function(error){
            console.log(error);
          }
        );
      };
      SessionSvc.registerUser($scope.user.nick, '$password$', startSession, startSession);
    };

    $scope.isLoggedIn = function() {
      return !!window.localStorage.getItem('userId');
    };

    $scope.logout = function() {
      SessionSvc.stopSession();
      $location.path('/');
    };
  }]);
