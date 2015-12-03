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
  'SessionSvc', 'url', '$rootScope', '$scope', '$route', '$location',
  '$timeout', 'SharedState', 'ProjectsSvc', 'ProfilesSvc', 'Loading',
  function(SessionSvc, url, $rootScope, $scope, $route, $location,
  $timeout, SharedState, ProjectsSvc, ProfilesSvc, Loading) {

    $scope.urlId = url.urlId;
    $scope.communityId = $route.current.params.comId;
    var projId = url.decodeUrlId($route.current.params.id);

    var timestampPadAccess = function(){
      ProfilesSvc.current().then(function(prof){
        prof.timestampPadAccess(projId);
      });
    };

    SessionSvc.onLoad(function(){
      Loading.create(ProjectsSvc.find($route.current.params.id)).
        then(function(proxy) {
          $scope.project = proxy;
        });

      timestampPadAccess();
    });

    $scope.$on('$routeChangeStart', function(){
      timestampPadAccess();
    });

    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262
    $scope.nav = function(id) {
      return id === 'pad' ? 'selected' : '';
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

    $scope.ed = {
      editting: false
    };

    $scope.padReady = function() {
      // FIXME
      // SwellRT editor is created with .wave-editor-off
      // Should use .wave-editor-on when SwellRT editor callback is available
      // https://github.com/P2Pvalue/swellrt/issues/84
      var editor = angular.element(document.getElementById('pad').children[0]);

      $scope.$watch(function(){
        return editor.attr('class');
      },
      function(newClass) {
        if (newClass === 'wave-editor-on') {
          editor.
            on('focus', function() {
              $scope.editOn();
            }).
            on('blur', function() {
              $scope.editOff();
            });
        }
      });
    };

    $scope.editOn = function() {
      $scope.ed.editting = true;

      $timeout();
    };

    $scope.editOff = function() {
      $scope.ed.editting = false;

      $timeout();
    };

    // Do not leave pad without giving a title to the project
    $rootScope.$on('$routeChangeStart', function(event) {
      if ($scope.project.type !== 'deleted' && ($scope.project.title === undefined || $scope.project.title === '')) {
        event.preventDefault();

        SharedState.turnOn('projectTitleReminder');
      }
    });
  }]);
