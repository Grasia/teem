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
        templateUrl: 'session/new.html',
        controller:'SessionCtrl'
      })
    .when('/session/userdata',{
      templateUrl: 'session/userdata.html',
      controller:'SessionCtrl'
    });
  }])

  .controller('SessionCtrl', [
    '$scope', '$location', '$route', 'SessionSvc', '$timeout', 'CommunitiesSvc',
    function($scope, $location, $route, SessionSvc, $timeout, CommunitiesSvc) {
    $scope.session = {};

    $scope.loginRegexp = new RegExp('^[a-zA-Z0-9\.]+$');

    $scope.user = {
      nick : ""
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
