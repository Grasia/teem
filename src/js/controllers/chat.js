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
  .controller('ChatCtrl', ['$scope', function($scope){
    $scope.project = {
      title: 'Feminist film festival',
      chat: [
        {
          text: 'Cómo mola el festival'
        },
        {
          text: 'Vamos a partir la pana'
        }
      ]
    };

  }]);
