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
      .when('/teems/:id/:new?', {
        templateUrl: 'projects/project.html',
        controller: 'ProjectCtrl',
        // Change between tabs without re-rendering the view
        reloadOnSearch: false
      })
      // Getting a project from projects widget
      .when('/communities/:communityId/teems/fetch/:id', {
        controller: 'FetchProject'
      })
      // Old stuff
      .when('/communities/:communityId/teems/:id', {
        redirectTo: function(params) {
          return '/teems/' + params.id;
        }
      })
      .when('/communities/:communityId/teems/:id/:tab', {
        redirectTo: function(params) {
          return '/teems/' + params.id + '?tab=' + params.tab;
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
        $location.path('/teems/' + url.urlId(project.id));
        return;
      }

      ProjectsSvc.create({
        communityId:  communityId
      }).then(function(project) {
        project.localId = localId;

        $location.path('/teems/' + url.urlId(project.id));
      });
    });
  }])
  .controller('ProjectCtrl', [
  'SessionSvc', 'url', '$scope', '$rootScope', '$location', '$route', '$timeout', 'swellRT',
  'SharedState', 'ProjectsSvc', 'Loading', '$window', 'NewForm', 'CommunitiesSvc',
  function (SessionSvc, url, $scope, $rootScope, $location, $route, $timeout, swellRT,
  SharedState, ProjectsSvc, Loading, $window, NewForm, CommunitiesSvc) {

    var edittingTitle = false;

    SessionSvc.onLoad(function(){
      Loading.show(ProjectsSvc.findByUrlId($route.current.params.id)).
        then(function(project) {
          $scope.project = project;

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

    $scope.uploadProjectPhoto = function(file) {
      $scope.project.image = new swellRT.FileObject(file);
    };

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

      // using location.host instead of $location.host because
      // it gives port information when needed
      return $location.protocol() + '://' +  location.host + '/#' + $location.path();
    };

    $scope.cancelProject = function() {
      SharedState.turnOff('projectTitleReminder');

      $scope.project.delete();

      $location.path('/');
    };

    $scope.hasChanged = function(section){

      if(!$scope.project || ! $scope.project.lastChange(section) ||
        !$scope.project.isContributor()){
        return false;
      }

      var lastChange = $scope.project.lastChange(section);
      var lastAccess;
          if ($scope.project.getTimestampAccess() &&
            $scope.project.getTimestampAccess()[section]) {
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
