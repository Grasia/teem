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
      .when('/projects/:id', {
        templateUrl: 'project.html',
        controller: 'ProjectCtrl',
        // Change between tabs without re-rendering the view
        reloadOnSearch: false
      })
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
  .controller('ProjectCtrl', [
  'SessionSvc', 'url', '$scope', '$rootScope', '$location', '$route',
  'SharedState', 'ProjectsSvc', 'Loading',
  function (SessionSvc, url, $scope, $rootScope, $location, $route,
  SharedState, ProjectsSvc, Loading) {

    $scope.urlId = url.urlId;

    function currentTab() {
      return $location.search().tab || 'pad';
    }

    SessionSvc.onLoad(function(){
      Loading.create(ProjectsSvc.find($route.current.params.id)).
        then(function(proxy) {
          $scope.project = proxy;

          $scope.project.timestampAccess(currentTab());
        });
    });

    $scope.titleReminder = function titleReminder() {
      SharedState.turnOff('projectTitleReminder');

      document.querySelector('.project-title input').focus();
    };

    SharedState.initialize($scope, 'projectTab',
      { defaultValue: currentTab() });

    $scope.$on('mobile-angular-ui.state.changed.projectTab', function(e, newVal, oldVal) {
      $scope.project.timestampAccess(oldVal);
      $scope.project.timestampAccess(newVal);

      $location.search({ tab: newVal});
    });

    $scope.$on('$routeChangeStart', function() {
      $scope.project.timestampAccess(currentTab());
    });

    $scope.cancelProject = function() {
      SharedState.turnOff('projectTitleReminder');
      $scope.project.type = 'deleted';
      $scope.project.communities = [];
      $location.path('frontpage');
    };

    // Do not leave pad without giving a title to the project
    $rootScope.$on('$routeChangeStart', function(event) {
      if ($scope.project.type !== 'deleted' && ($scope.project.title === undefined || $scope.project.title === '')) {
        event.preventDefault();

        SharedState.turnOn('projectTitleReminder');
      }
    });
  }]);
