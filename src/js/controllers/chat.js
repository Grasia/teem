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
  .controller('ChatCtrl', ['pear', '$scope', '$rootScope', '$route', function(pear, $scope, $rootScope, $route){

    $scope.id = $route.current.params.id;
    $scope.userId = $rootScope.userId;
    $scope.chat = {_new : ''};

    pear.onLoad(function(){
        $scope.project = pear.projects.find($scope.id);
        $scope.projects = pear.projects.all();
    });

    $scope.send = function(){
      pear.addChatMessage($scope.id, $scope.chat._new, $scope.userId);
    };

    $scope.standpoint = function(msg){
      return (msg.who === $scope.userId)? 'mine': 'their';
    }
    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262
    $scope.nav = function(id) {
      return id === 'chat' ? 'active' : '';
    };
  }]);
