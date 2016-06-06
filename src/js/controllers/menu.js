'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the Teem
 */

angular.module('Teem')
  .controller('MenuCtrl', [
  '$scope', 'config', 'Url', 'SessionSvc', 'CommunitiesSvc', 'ProjectsSvc',
  'User', '$timeout', 'SharedState', '$location',
  function($scope, config, Url, SessionSvc, CommunitiesSvc, ProjectsSvc,
           User, $timeout, SharedState, $location){
    if (config.support) {
      $scope.support = {
        communityId: Url.encode(config.support.communityId),
        projectId:   Url.encode(config.support.projectId)
      };
    }

    $scope.close = function() {
      SharedState.turnOff('uiSidebarLeft');
    };

    $scope.register = function () {
      SharedState.initialize($scope, 'session');
      SharedState.set('session', 'register');
      SharedState.set('modalSharedState', 'session');
      $timeout();
    };

    $scope.loggedIn = function () {
      return SessionSvc.users.loggedIn();
    };

    $scope.logout = function () {
      SessionSvc.stopSession();
      $location.path('/');
    };

    // We probably need to refactor this

    function userData () {
      $scope.user = User.current();

      CommunitiesSvc.participating().then(function(communities) {
        $timeout(function () {
          $scope.userCommunitiesCount = communities.length;
        });
      });

      ProjectsSvc.contributing().then(function (projects) {
        $timeout(function () {
          $scope.userProjectsCount = projects.length;
        });
      });
    }

    SessionSvc.onLoad(function() {
      if (User.loggedIn()) {
        userData();
      }

      $scope.$on('teem.login', userData);

      // note that because queries are not real time we can not just call userData
      $scope.$on('teem.project.join', function(){
        $scope.userProjectsCount += 1;
      });

      $scope.$on('teem.project.leave', function(){
        $scope.userProjectsCount -= 1;
      });

      $scope.$on('teem.community.join', function(){
        $scope.userCommunitiesCount += 1;
      });

      $scope.$on('teem.community.leave', function(){
        $scope.userCommunitiesCount -= 1;
      });




    });
  }]);
