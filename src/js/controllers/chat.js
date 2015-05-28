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

    $scope.id = $route.current.params.id;

    $scope.chat = {_new : ''};

    pear.onLoad(function(){
        $scope.project = pear.projects.find($scope.id);
        $scope.projects = pear.projects.all();
    });

    $scope.send = function(){
      // TODO change 'me' by actual username
      pear.addChatMessage($scope.id, $scope.chat._new, 'me');
    };

    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262
    $scope.nav = function(id) {
      return id === 'chat' ? 'active' : '';
    };
  }]);
