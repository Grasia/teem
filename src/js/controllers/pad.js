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
  'SwellRTSession', 'url', '$rootScope', '$scope', '$route', '$location', '$timeout', 'SharedState', 'ProjectsSvc', '$rootElement',
  function(SwellRTSession, url, $rootScope, $scope, $route, $location, $timeout, SharedState, ProjectsSvc, $rootElement) {

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

    $scope.isAndroid5 = function(){
      var ua = navigator.userAgent.toLowerCase();
      var match = ua.match(/android\s([0-9\.]*)/);
      return match ? parseInt(match[1], 10) === 5 : false;
    };

    angular.element(document.querySelector('.swellrt-editor')).on(
      'focusin',
      function(){
        if ($scope.project.isContributor()){
          $timeout(function(){
            document.getElementById('pad').focus();
            $scope.toggleFullScreenEdit();
          });
        }
      });

    // Do not leave pad without giving a title to the project
    $rootScope.$on('$routeChangeStart', function(event) {
      if ($scope.project.type !== 'deleted' && ($scope.project.title === undefined || $scope.project.title === '')) {
        event.preventDefault();

        SharedState.turnOn('projectTitleReminder');
      }
    });

    $scope.ed = {
      editting: false
    };

    $scope.toggleFullScreenEdit = function() {

      $scope.ed.editting = !$scope.ed.editting;

      if ($scope.ed.editting) {
        $rootElement.removeClass('has-navbar-top');
        document.getElementById('pad').focus();
      } else {
        $rootElement.addClass('has-navbar-top');
      }

      $rootScope.hideNavigation = $scope.ed.editting;
    };

  }]);
