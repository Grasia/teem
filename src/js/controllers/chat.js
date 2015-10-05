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
      .when('/communities/:comId/projects/:id/chat', {
        templateUrl: 'chat/show.html',
        controller: 'ChatCtrl'
      });
  }])
  .directive('pearChatScroll', function() {
    return function(scope, element) {
      if (scope.$last) {
        setTimeout(function() {
          var bottom = angular.element(element);

          if (bottom) {
            var scrollableContentController = bottom.controller('scrollableContent');

            scrollableContentController.scrollTo(bottom);
          }
        }, 50);
      }
    };
  })
  .controller('ChatCtrl', [
              'SwellRTSession', 'pear', '$scope', '$rootScope', '$route', '$location', '$animate', 'common', 'ProjectsSvc',
              function(SwellRTSession, pear, $scope, $rootScope, $route, $location, $animate, common, ProjectsSvc){

    $scope.urlId = pear.urlId;
    $scope.communityId = $route.current.params.comId;

    SwellRTSession.onLoad(function(){
      ProjectsSvc.find($route.current.params.id).then(
        function(proxy){
          $scope.project = proxy;
          $scope.project.timestampProjectAccess();
        });
    });

    // Send button
    $scope.send = function(){
      var msg = $scope.newMsg.trim();

      if (msg === '') {
        return;
      }

      $scope.project.addChatMessage(msg);

      $scope.newMsg = '';
    };

    // Scroll to bottom after adding a message
    $animate.on('enter', angular.element(document.querySelector('.chat-messages')), function(msg) {
      var scrollableContentController = msg.controller('scrollableContent');

      scrollableContentController.scrollTo(msg);
    });


    $scope.standpoint = function(msg){
      if (!SwellRTSession.users.current()) {
        return msg.standpoint || 'their';
      }
      return msg.standpoint || (SwellRTSession.users.isCurrent(msg.who) ? 'mine' : 'their');
    };

    $scope.theirStandpoint = function(msg) {
      return $scope.standpoint(msg) === 'their';
    };

    $scope.isNotificationMessage = function(msg){
      return $scope.standpoint(msg) === 'notification';
    };


    $scope.hour = function(msg) {
      return common.time.hour(new Date(msg.time));
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

    $scope.dayChange = function(msg, index){
      var d = new Date(msg.time);
      if (index > 0 && d.getDate() !== new Date($scope.project.chat[index -1].time).getDate()){
        return common.time.date(d);
      };
      return undefined;
    };
  }]);
