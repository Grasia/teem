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
    '$scope', '$location', '$route', 'SessionSvc', '$timeout', 'CommunitiesSvc',
    function($scope, $location, $route, SessionSvc, $timeout, CommunitiesSvc) {
    $scope.session = {};

    $scope.loginRegexp = new RegExp('^[a-zA-Z0-9\.]+$');

    $scope.user = {
      nick : ''
    };

    var redirect = function(params) {
      $timeout(function(){
        var redirect = params.redirect;
        // redirects are of the form /community/:communityId/project/projectId
        var communityId = redirect.split('/')[2];
        CommunitiesSvc.setCurrent(communityId);
        $location.url(redirect);
      });
    };

    $scope.login = function() {
      var startSession = function(){
        // TODO change password when register is available
        SessionSvc.startSession(
          $scope.user.nick, SessionSvc.users.password,
          function(){
            $timeout(function(){
              if ($route.current.params.redirect) {
                redirect($route.current.params);
              }
              else {
                $location.path('/communities');
              }
            });
          },
          function(error){
            console.log(error);
          }
        );
      };
      SessionSvc.registerUser($scope.user.nick, '$password$', startSession, startSession);
    };

    // Check for stored session information
    if (SessionSvc.users.current() !== null) {
      if (CommunitiesSvc.current() && !$route.current.params.redirect){
        $location.path('/communities/' + CommunitiesSvc.current() + '/projects');
      } else if ($route.current.params.redirect) {
        redirect($route.current.params);
      } else {
        $location.path('/communities');
      }
    }
  }]);
