'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ChatCtrl
 * @description
 * # Chat Ctrl
 * Show Pad for a given project
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/communities/:comId/projects/:id/pad', {
        templateUrl: 'pad/show.html',
        controller: 'PadCtrl'
      });
  }])
  .controller('PadCtrl', [
              'SwellRTSession', 'url', '$rootScope', '$scope', '$route', '$location', '$timeout', 'SharedState', 'ProjectsSvc',
              function(SwellRTSession, url, $rootScope, $scope, $route, $location, $timeout, SharedState, ProjectsSvc){

    $scope.urlId = url.urlId;
    $scope.communityId = $route.current.params.comId;

    SwellRTSession.onLoad(function(){
      ProjectsSvc.find($route.current.params.id)
        .then(function(proxy) {
          $scope.project = proxy;
          $scope.project.timestampProjectAccess();
        });
    });

    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262
    $scope.nav = function(id) {
      return id === 'pad' ? 'active' : '';
    };

    $scope.titleReminder = function titleReminder() {
      SharedState.turnOff('projectTitleReminder');

      document.querySelector('.project-title input').focus();
    };

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

    angular.element(document.querySelector('.swellrt-editor')).on(
      'focusin',
      function(){
        $scope.project.addContributor();
      });

    $scope.ed = {
      editting: false
    };

  }]);
