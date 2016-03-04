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
  'User', '$timeout', 'SharedState',
  function($scope, config, url, SessionSvc, CommunitiesSvc, ProjectsSvc,
           User, $timeout, SharedState){
    if (config.support) {
      $scope.support = {
        communityId: url.urlId(config.support.communityId),
        projectId:   url.urlId(config.support.projectId)
      };
    }

    $scope.register = function () {
      SharedState.turnOn('shouldLoginSharedState');
    };

    $scope.loggedIn = function () {
      return SessionSvc.users.loggedIn();
    };

    $scope.logout = function () {
      SessionSvc.stopSession();

      SessionSvc.users.on('login', userData);
    };

    // We probably need to refactor this

    function userData () {
      $scope.userNick = User.current().nick;

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
      } else {
        SessionSvc.users.on('login', userData);
      }
    });
  }]);
