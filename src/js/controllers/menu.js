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
      SharedState.set('modalSharedState', {name: 'session', type: 'register'});
      $timeout();
    };

    $scope.login = function () {
      SharedState.set('modalSharedState', {name: 'session', type: 'login'});
      $timeout();
    };

    $scope.logout = function () {
      SessionSvc.stopSession();
      $location.path('/');
    };

    $scope.communities = [];

    $scope.projects = [];

    // to distinguis new projects and communities after queries
    $scope.fetchedIds = new Set();

    $scope.search = {
      input: ''
    };

    function initialize (){

      $scope.$watch('search.input', function(value){

        if (!value || value.length < 2) {
          return;
        }

        var commsPromise = CommunitiesSvc.all({
          nameLike: value
        });

        commsPromise.then(function(communities) {

          communities.forEach(function(c){
            if (!$scope.fetchedIds.has(c.id)){
              $scope.communities.push(c);
              $scope.fetchedIds.add(c.id);
            }
          });

        });

        var projsPromise = ProjectsSvc.all({
          titleLike: value
        });

        projsPromise.then(function(projects) {

          projects.forEach(function(p){
            if (!$scope.fetchedIds.has(p.id)){
              $scope.projects.push(p);
              $scope.fetchedIds.add(p.id);
            }
          });

        });
      });
    }

    SessionSvc.onLoad(initialize);

    $scope.focusSearchInput = function(focus = true){
      $timeout(function(){
        if (focus){
          angular.element('#search-input')[0].focus();
        } else {
          angular.element('#search-input')[0].blur();
        }
      });
    };

    $scope.shouldHideDropdown = function(){
      return angular.element('#search-input:focus')[0] === undefined;
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
