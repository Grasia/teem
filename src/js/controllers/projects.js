'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the Teem
 */

angular.module('Teem')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/communities/:communityId/projects', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      })
      .when('/home/projects', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      })
      .when('/projects', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      });
  }])
  .controller('ProjectsCtrl', [
  'SessionSvc', 'url', '$scope', '$location', '$route', 'time',
  'CommunitiesSvc', 'ProjectsSvc', 'ProfilesSvc', '$timeout', 'Loading',
  '$rootScope',
  function (SessionSvc, url, $scope, $location, $route, time,
  CommunitiesSvc, ProjectsSvc, ProfilesSvc, $timeout, Loading, $rootScope) {
    var communityId = $route.current.params.communityId;

    $scope.translationData = {};

    if (communityId) {
      $scope.context = 'community';
    } else if ($location.path() === '/home/projects') {
      $scope.context = 'home';
    } else {
      $scope.context = 'public';
    }

    function getCommunities(projects) {
      angular.forEach(projects, function(p) {
        angular.forEach(p.communities, function(id) {
          CommunitiesSvc.find(id).then(function(c) {
            $timeout(function() {
              if (! p.loadedCommunities) {
                p.loadedCommunities = [];
              }

              p.loadedCommunities.push(c);
            });
          });
        });
      });
    }

    SessionSvc.onLoad(function(){
      switch ($scope.context) {
        case 'community':
          Loading.show(CommunitiesSvc.findByUrlId($route.current.params.communityId)).
            then(function(community){
              $scope.community = community;

              $scope.translationData.community = community.name;

              Loading.show(community.myAndPublicProjects()).
                then(function (projects){

                  $scope.projects = projects;

                });
            });

          break;
        case 'home':
          SessionSvc.loginRequired($scope, function() {
            Loading.show(ProjectsSvc.all({ contributor: SessionSvc.users.current() })).
              then(function(projects) {
                getCommunities(projects);

                $scope.projects = projects;

                $scope.translationData.count = projects.length;

                $rootScope.$broadcast('teem.project.count', projects.length);
              });
          });

          break;
        default:
          Loading.show(ProjectsSvc.all({ shareMode: 'public' })).
            then(function(projects) {
              getCommunities(projects);

              $scope.projects = projects;
            });
      }
    });
  }]);
