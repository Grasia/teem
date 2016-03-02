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
      .when('/communities/:comId/projects', {
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
  function (SessionSvc, url, $scope, $location, $route, time,
  CommunitiesSvc, ProjectsSvc, ProfilesSvc, $timeout, Loading) {

    $scope.urlId= url.urlId;

    var comUrlId = $route.current.params.comId;

    // get the count of new edits and chats for a list of projects and store them in the project properties
    // Refactoring...
    function getNewsCounts(projs) {
      angular.forEach(projs, function(proj) {
        if (proj.contributors.indexOf(SessionSvc.users.current()) > -1) {
          proj.isContributor = true;
        }
      });
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
      if ($route.current.params.comId) {
        Loading.show(CommunitiesSvc.findByUrlId(comUrlId)).
          then(function(community){
            $scope.community = community;

            Loading.show(community.myAndPublicProjects()).
              then(function (projects){
                getNewsCounts(projects);

                $scope.projects = projects;
              });
          });
      } else {
        if (SessionSvc.users.loggedIn()) {
          Loading.show(ProjectsSvc.all({ contributor: SessionSvc.users.current() })).
            then(function(projects) {
              getNewsCounts(projects);
              getCommunities(projects);

              $scope.projects = projects;
            });
        }
      }

      $scope.new_ = function () {
        SessionSvc.loginRequired(function() {
          $scope.created = true;

          ProjectsSvc.create({
            communityId: $scope.community.id
          }, function(p) {
            //FIXME model prototype
            $location.path('/projects/' + url.urlId(p.id));
          });
        });
      };
    });
  }]);
