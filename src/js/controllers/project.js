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
      .when('/projects/:id/:new?', {
        templateUrl: 'projects/project.html',
        controller: 'ProjectCtrl',
        // Change between tabs without re-rendering the view
        reloadOnSearch: false
      })
      // Getting a project from projects widget
      .when('/communities/:communityId/projects/fetch/:id', {
        controller: 'FetchProject'
      })
      // Old stuff
      .when('/communities/:communityId/projects/:id', {
        redirectTo: function(params) {
          return '/projects/' + params.id;
        }
      })
      .when('/communities/:communityId/projects/:id/:tab', {
        redirectTo: function(params) {
          return '/projects/' + params.id + '?tab=' + params.tab;
        }
      });
  }])
  .controller('FetchProject', [
  'ProjectsSvc', 'url', '$route', '$location',
  function(ProjectsSvc, url, $route, $location) {
    var communityId = url.decodeUrlId($route.current.params.communityId),
        localId     = $route.current.params.id;

    ProjectsSvc.all({
      community: communityId,
      localId: localId
    }).then(function(projects) {
      var project = projects[0];

      if (project) {
        $location.path('/projects/' + url.urlId(project.id));
        return;
      }

      ProjectsSvc.create({
        communityId:  communityId
      }).then(function(project) {
        project.localId = localId;

        $location.path('/projects/' + url.urlId(project.id));
      });
    });
  }])
  .controller('ProjectCtrl', [
  'SessionSvc', 'url', '$scope', '$rootScope', '$location', '$route', '$timeout',
  'SharedState', 'ProjectsSvc', 'Loading', '$window', 'NewForm', 'CommunitiesSvc',
  function (SessionSvc, url, $scope, $rootScope, $location, $route, $timeout,
  SharedState, ProjectsSvc, Loading, $window, NewForm, CommunitiesSvc) {

    var edittingTitle = false;

    SessionSvc.onLoad(function(){
      Loading.show(ProjectsSvc.findByUrlId($route.current.params.id)).
        then(function(project) {
          $scope.project = project;
          $scope.project.setTimestampAccess(currentTab());

          CommunitiesSvc.allByIds(project.communities).then(function (communities) {
            $timeout(function() {
              $scope.communities = communities;
            });
          });
        });
    });

    function currentTab() {
      return $location.search().tab || 'pad';
    }

    SharedState.initialize($scope, 'projectTab', {
      defaultValue: currentTab()
    });

    NewForm.initialize($scope, 'project');

    $scope.edittingTitle = function() {
      return edittingTitle || $scope.isNew();
    };

    $scope.showEditTitle = function() {
      edittingTitle = true;
    };

    $scope.hideEditTitle = function() {
      edittingTitle = false;
    };

    $scope.titleReminder = function titleReminder() {
      SharedState.turnOff('projectTitleReminder');

      document.querySelector('.project-title input').focus();
    };


    $scope.$on('mobile-angular-ui.state.changed.projectTab', function(e, newVal, oldVal) {
      $scope.project.setTimestampAccess(oldVal);
      $scope.project.setTimestampAccess(newVal);

      $location.search({ tab: newVal});
    });

    $scope.$on('$routeChangeStart', function(event, next, current) {
      if (current.params.tab !== undefined) {
        $scope.project.setTimestampAccess(current.params.tab);
      }
    });

    $scope.linkCurrentProject = function() {
      return $location.absUrl();
    };

    $scope.cancelProject = function() {
      SharedState.turnOff('projectTitleReminder');

      $scope.project.delete();

      $location.path('frontpage');
    };

    $scope.hasChanged = function(section){

      if(!$scope.project || ! $scope.project.lastChange(section) ||
        !SessionSvc.users.current()){
        return false;
      }

      var lastChange = $scope.project.lastChange(section);
      var lastAccess;
          if ($scope.project.getTimestampAccess()[section]) {
            lastAccess = new Date(($scope.project.getTimestampAccess()[section]).last);
          } else {
            lastAccess = new Date(0);
          }
      return lastChange > lastAccess;
    };

    // Do not leave pad without giving a title to the project
    $rootScope.$on('$routeChangeStart', function(event) {
      if ($scope.project.type !== 'deleted' && ($scope.project.title === undefined || $scope.project.title === '')) {
        event.preventDefault();

        SharedState.turnOn('projectTitleReminder');
      }
    });
  }]);
