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
      .when('/communities/:communityId/projects/:id/pad', {
        templateUrl: 'pad/show.html',
        controller: 'PadCtrl'
      });
  }])
  .directive('focusMe', function () {
    return {
        link: function(scope, element, attrs) {
            scope.$watch(attrs.focusMe, function(value) {
                if(value === true) {
                    element[0].focus();
                    element[0].select();
                }
            });
        }
    };
  })
  .controller('PadCtrl', [
              'pear', '$rootScope', '$scope', '$route', '$location', '$timeout', 'SharedState',
              function(pear, $rootScope, $scope, $route, $location, $timeout, SharedState){

    $scope.urlId = pear.urlId;
    $scope.communityId = $route.current.params.communityId;

    pear.onLoad(function(){
      pear.projects.find($route.current.params.id)
        .then(function(proxy) {
          $scope.project = proxy;
          if ($scope.project.title === ''){
            $scope.editingTitle = true;
          }
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

    // Do not leave pad without giving a title to the project
    $rootScope.$on('$routeChangeStart', function(event) {
      if ($scope.project.title === undefined || $scope.project.title === '') {
        event.preventDefault();

        SharedState.turnOn('projectTitleReminder');
      }
    });

    angular.element(document.querySelector('.swellrt-editor')).on(
      'focusin',
      function(){
        pear.projects
          .addContributor($route.current.params.id);
      });
  }]);
