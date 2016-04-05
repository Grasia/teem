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
  '$scope', 'config', 'url', 'SessionSvc', 'CommunitiesSvc', 'ProjectsSvc',
  'User', '$timeout', 'SharedState', '$location',
  function($scope, config, url, SessionSvc, CommunitiesSvc, ProjectsSvc,
           User, $timeout, SharedState, $location){
    if (config.support) {
      $scope.support = {
        communityId: url.urlId(config.support.communityId),
        projectId:   url.urlId(config.support.projectId)
      };
    }

    $scope.register = function () {
      SharedState.set('shouldLoginSharedState', 'register');
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
