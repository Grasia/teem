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
  .directive('pearChatScroll', function() {
    return function(scope, element) {
      if (scope.$last) {
        setTimeout(function() {
          var bottom = angular.element(element);
          var scrollableContentController = bottom.controller('scrollableContent');

          scrollableContentController.scrollTo(bottom);
        }, 50);
      }
    };
  })
  .controller('ChatCtrl', ['pear', '$scope', '$rootScope', '$route', '$location', '$animate', function(pear, $scope, $rootScope, $route, $location, $animate){

    $scope.id = $route.current.params.id;

    pear.onLoad(function(){
      $scope.project = pear.projects.find($scope.id);
      $scope.projects = pear.projects.all();
    });

    // Send button
    $scope.send = function(){
      var msg = $scope.newMsg.trim();

      if (msg === '') {
        return;
      }

      pear.addChatMessage($scope.id, msg);

      $scope.newMsg = '';
    };

    // Scroll to bottom after adding a message
    $animate.on('enter', angular.element('.chat-messages'), function(msg) {
      var scrollableContentController = msg.controller('scrollableContent');

      scrollableContentController.scrollTo(msg);
    });


    $scope.standpoint = function(msg){
      if (!pear.users.current()) {
        return 'their';
      }
      return pear.users.isCurrent(msg.who) ? 'mine' : 'their';
    };

    $scope.theirStandpoint = function(msg) {
      return $scope.standpoint(msg) === 'their';
    };

    $scope.hour = function(msg) {
      var d = (new Date(msg.time));

      return d.getHours() + ':' + (d.getMinutes()<10?'0':'') + d.getMinutes();
    };

    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262
    $scope.nav = function(id) {
      return id === 'chat' ? 'active' : '';
    };

    $scope.showPad = function() {
      $location.path('/projects/' + $scope.project.id + '/pad');
    };

    $scope.addToPad = function(txt) {
      var p = $scope.project.pad;
      p.newLine(p.size());
      p.insert(txt, p.size());
      $scope.showPad();
    };

    // Temporal way to destroy a project
    $scope.destroyProject = function() {
      pear.projects.destroy($scope.project.id);
    };
  }]);
