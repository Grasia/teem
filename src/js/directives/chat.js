'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:ChatCtrl
 * @description
 * # Chat Ctrl
 * Show Chat for a given project
 */

angular.module('Teem')
  .directive('chatScroll', [
  '$timeout',
  function($timeout) {
    return function(scope, element) {
      if (scope.$last) {
        $timeout(function() {
          var bottom = angular.element(element);
          var newMessages = angular.element(document.getElementById('newMessages'));

          if (bottom) {
            var scrollableContentController = bottom.controller('scrollableContent');

            if (scrollableContentController) {
              if (newMessages && newMessages.length > 0){
                scrollableContentController.scrollTo(newMessages);
              } else {
                scrollableContentController.scrollTo(bottom);
              }
            }
          }
        }, 50);
      }
    };
  }])
  .directive('chat', function() {
    return {
      controller: [
        'SessionSvc', 'url', '$scope', '$rootScope', '$route', '$location',
        '$animate', 'time',
        function(SessionSvc, url, $scope, $rootScope, $route, $location,
        $animate, time){
          const pageSize = 10;

          $scope.pageSize = pageSize;
          $scope.pageOffset = - pageSize;

          $scope.nextPage = function() {
            if ($scope.project.chat.length > $scope.pageSize) {
              $scope.pageSize += pageSize;
              $scope.pageOffset -= pageSize;
            }
          };

          // Send button
          $scope.send = function(){
            var msg = $scope.newMsg.trim();

            if (msg === '') {
              return;
            }

            $scope.project.addChatMessage(msg);

            $scope.newMsg = '';

            document.querySelector('.chat-textarea').focus();
          };

          $scope.standpoint = function(msg){
            if (!SessionSvc.users.current()) {
              return msg.standpoint || 'their';
            }
            return msg.standpoint || (SessionSvc.users.isCurrent(msg.who) ? 'mine' : 'their');
          };

          $scope.theirStandpoint = function(msg) {
            return $scope.standpoint(msg) === 'their';
          };

          $scope.isNotificationMessage = function(msg){
            return $scope.standpoint(msg) === 'notification';
          };


          $scope.hour = function(msg) {
            return time.hour(new Date(msg.time));
          };

          $scope.showPad = function() {
            $location.path('/teems/' + url.urlId($route.current.params.id) + '/pad');
          };

          $scope.addToPad = function(txt) {
            var p = $scope.project.pad;
            p.newLine(p.size() - 1);
            p.insert(p.size() - 1, txt);
            $scope.showPad();
          };

          $scope.dayChange = function(msg, index){
            var d = new Date(msg.time),
                prevIndex = $scope.project.chat.length + $scope.pageOffset + index - 1;

            if (index === 0 || (index > 0 && d.getDate() !== new Date($scope.project.chat[prevIndex].time).getDate())){
              return time.date(d);
            }
            return undefined;
          };

          $scope.firstNewMessage = function (msg, index){
            var d = new Date(msg.time);

            if ($scope.project.getTimestampAccess().chat) {
              var previousAccess = new Date($scope.project.getTimestampAccess().chat.prev);
              if (index > 0 && d > previousAccess && previousAccess > new Date($scope.project.chat[index -1].time)){
                return true;
              }
            }
            return false;
          };

          $scope.keyDown = function(event){
            if (event.which === 13) {
              $scope.send();

              event.preventDefault();
            }
          };
        }
      ],
      templateUrl: 'chat.html'
    };
  });
