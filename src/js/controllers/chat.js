'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ChatCtrl
 * @description
 * # Chat Ctrl
 * Show Chat for a given project
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/projects/:id/chat', {
        templateUrl: 'chat/show.html',
        controller: 'ChatCtrl'
      });
  }])
  .controller('ChatCtrl', ['pear', '$scope', '$route', function(pear, $scope, $route){
    $scope.project = pear.projects.find($route.current.params.id);
    $scope.projects = pear.projects;
    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262 
    $scope.nav = function(id) {
      return id === 'chat' ? 'active' : '';
    };
  }]);
