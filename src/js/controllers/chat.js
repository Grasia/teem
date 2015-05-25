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
  .controller('ChatCtrl', ['pear', '$scope', '$route', '$location', function(pear, $scope, $route, $location){
    $scope.project = pear.projects.find($route.current.params.id);

    $scope.projectIndex = function() {
      $location.path('projects');
    };
  }]);
