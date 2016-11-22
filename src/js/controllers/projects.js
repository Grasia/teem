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
      // Transition from old project paths
      .when('/communities/:communityId/projects', {
        redirectTo: function(params) {
          return '/communities/' + params.communityId + '/teems';
        }
      })
      .when('/home/projects', {
        redirectTo: function() {
          return '/home/teems';
        }
      })
      .when('/projects', {
        redirectTo: function() {
          return '/teems';
        }
      })
      .when('/communities/:communityId/teems', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      })
      .when('/home/teems', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      })
      // featured, latest and new routes are defined in the project (singular) controller
      // so they take precendence over /teems/:id
      .when('/teems', {
        redirectTo: () => {
          return '/teems/featured';
        }
      });
  }])
  .controller('ProjectsCtrl', [
  'SessionSvc', '$scope', '$location', '$route', 'time',
  'CommunitiesSvc', 'ProjectsSvc', 'ProfilesSvc', '$timeout', 'Loading',
  function (SessionSvc, $scope, $location, $route, time,
  CommunitiesSvc, ProjectsSvc, ProfilesSvc, $timeout, Loading) {
    var communityId = $route.current.params.communityId;
    var projectId = $location.path().startsWith('/teems/') && $route.current.params.id;

    $scope.translationData = {};

    // New project stuff
    // Render communities code but redirect to new project
    if ($location.path() === '/teems/new') {
      SessionSvc.loginRequired($scope, function() {
        ProjectsSvc.create({}, function(c) {
          $location.path(c.path()).search('form', 'image');
        });
      },
      {
        form: 'register',
        message: 'new_project'
      });
    }

    if (communityId) {
      $scope.context = 'community';
    } else if (projectId) {
      $scope.context = 'project';
    } else if ($location.path() === '/home/teems') {
      $scope.context = 'home';
    } else if ($location.path() === '/teems/featured') {
      $scope.context = 'featured';
    }  else if ($location.path() === '/teems/latest') {
      $scope.context = 'latest';
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
      CommunitiesSvc.all({ ids: Object.getOwnPropertyNames(communityProjects)})
        .then(function(coms){
          // add the community information to all the projects that belog to them
          angular.forEach(coms, function(c){
            angular.forEach(communityProjects[c.id], function(proj){
              proj.loadedCommunities.push(c);
            });
          });
        });
    }

    $scope.bussyPagination = true;
    $scope.finishedPagination = false;

    $scope.getProjectsPage = function() {
      if ($scope.bussyPagination){
        return;
      }
      if ($scope.projects && typeof $scope.projsNextPage === 'function'){
        $scope.bussyPagination = true;
        $timeout();
        var projsPromise = $scope.projsNextPage();
        projsPromise.then((projects)=>{
          if (projects.length > 0) {
            Array.prototype.push.apply(
              $scope.projects,
              projects);
          } else {
              $scope.finishedPagination = true;
          }
          $scope.projsNextPage = projsPromise.next;
          $scope.bussyPagination = false;
          //update offset
          $timeout();
          $scope.scrollFunct();
        });
      }
    };

    switch ($scope.context) {
      case 'featured':
        $scope.sortKey = '-featureDate()';
        break;
      case 'latest':
        $scope.sortKey = '-creationDate';
        break;
      default:
        $scope.sortKey = '-lastChange().getTime()';
    }

    $scope.createProject = function(){
      SessionSvc.loginRequired($scope, function() {

        var params = {};

        if ($scope.communityId) {
          params.communityId = $route.current.params.communityId;
        }

        ProjectsSvc.create(params, function(p) {
          $location.path(p.path()).search('form', 'image');
        });
      });
    };

    SessionSvc.onLoad(function(){
      switch ($scope.context) {
        case 'community':
          var projsPromise = CommunitiesSvc.findByUrlId($route.current.params.communityId);
          projsPromise.
            then(function(community){
              $scope.community = community;

              $scope.translationData.community = community.name;

              community.myAndPublicProjects({projection: ProjectsSvc.projectListProjection}).
                then(function (projects){

                  $scope.projects = projects;
                  $scope.bussyPagination = false;
                  $scope.projsNextPage = projsPromise.next;
                });
            });

          break;
        case 'home':
        case 'project':
          SessionSvc.loginRequired($scope, function() {
            var q = { contributor: SessionSvc.users.current() };
            q.projection = ProjectsSvc.projectListProjection;

            var projsPromise = ProjectsSvc.all(q);
            projsPromise.
              then(function(projects) {

                // Exclude current project
                if (projectId) {
                  projects = projects.filter(project => project._urlId !== projectId);
                }

                getCommunities(projects);

                $scope.projects = projects;
                $scope.bussyPagination = false;
                $scope.projsNextPage = projsPromise.next;
                $scope.translationData.count = projects.length;
              });
          });

          break;

        case 'featured':
        case 'latest':
          var q = {shareMode: 'public'};

          if ($scope.context === 'featured'){
            q.featured = true;
          } else if ($scope.context === 'latest'){
            q.latest = true;
          }

        q.projection = ProjectsSvc.projectListProjection;

          var defProjsPromiseFeat = ProjectsSvc.all(q);
          defProjsPromiseFeat.
            then(function(projects) {
              getCommunities(projects);

              $scope.projects = projects;
              $scope.bussyPagination = false;
              $scope.projsNextPage = defProjsPromiseFeat.next;
            });
          break;

        default:
          var defProjsPromise = ProjectsSvc.all({
            shareMode: 'public',
            projection: ProjectsSvc.projectListProjection
          });

          defProjsPromise.
            then(function(projects) {
              getCommunities(projects);

              $scope.projects = projects;
              $scope.bussyPagination = false;
              $scope.projsNextPage = defProjsPromise.next;
            });
      }
    });
  }]);
