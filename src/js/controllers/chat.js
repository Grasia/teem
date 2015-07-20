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
      .when('/communities/:communityId/projects/:id/chat', {
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
  .controller('ChatCtrl', [
              'pear', '$scope', '$rootScope', '$route', '$location', '$animate',
              function(pear, $scope, $rootScope, $route, $location, $animate){

    $scope.urlId = pear.urlId;
    $scope.communityId = $route.current.params.communityId;

    pear.onLoad(function(){
      pear.projects.find($route.current.params.id).then(
        function(proxy){
          $scope.project = proxy;
        });
    });

    // Send button
    $scope.send = function(){
      var msg = $scope.newMsg.trim();

      if (msg === '') {
        return;
      }

      pear.addChatMessage(pear.urlId($scope.project.id), msg);

      $scope.newMsg = '';
    };

    // Scroll to bottom after adding a message
    $animate.on('enter', angular.element(document.querySelector('.chat-messages')), function(msg) {
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
      $location.path('/projects/' + pear.urlId($route.current.params.id) + '/pad');
    };

    $scope.addToPad = function(txt) {
      var p = $scope.project.pad;
      p.newLine(p.size() - 1);
      p.insert(p.size() - 1, txt);
      $scope.showPad();
    };
  }]);
