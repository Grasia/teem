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
      .when('/communities/:communityId/teems', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      })
      .when('/home/teems', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      })
      .when('/teems', {
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
    } else if ($location.path() === '/home/teems') {
      $scope.context = 'home';
    } else {
      $scope.context = 'public';
    }

    function getCommunities(projects) {

      /*
      Map of projects by community:
        keys: communityId,
        values: list of projects that belong to the community in the key
      */
      var communityProjects = {};

      angular.forEach(projects, function(p) {
        p.loadedCommunities = [];

        angular.forEach(p.communities, function(id) {
          if(!communityProjects[id]) {
            communityProjects[id] = [];
          }

          communityProjects[id].push(p);
        });
      });

      // get all the communities referred from projects in <projects>
      CommunitiesSvc.allByIds(Object.getOwnPropertyNames(communityProjects))
        .then(function(coms){
          // add the community information to all the projects that belog to them
          angular.forEach(coms, function(c){
            angular.forEach(communityProjects[c.id], function(proj){
              proj.loadedCommunities.push(c);
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
