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
      if (scope.$last || scope.$index === scope.defaultPageSize - 1) {
        $timeout(function() {
          var angularElement = angular.element(element),
              controller = angularElement.controller('scrollableContent');

          if (scope.$last) {
            var newMessages = angular.element(document.getElementById('newMessages'));

            if (newMessages && newMessages.length > 0){
              controller.scrollTo(newMessages);
            } else {
              controller.scrollTo(angularElement);
            }
          } else {
            controller.scrollTo(angularElement);
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
          // For scrolling in chatScroll directive
          $scope.defaultPageSize = pageSize;
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

          // TODO: delete notification messages
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

          // Returns the previous message to the one that has the index
          // in the current pagination
          function prevMessage(index) {
            var prevIndex = index - 1;

            if ($scope.project.chat.length > $scope.pageSize) {
              prevIndex += $scope.project.chat.length + $scope.pageOffset;
            }

            return $scope.project.chat[prevIndex];
          }

          $scope.dayChange = function(msg, index){
            var d = new Date(msg.time),
                prev = prevMessage(index);

            if (!prev || d.getDate() === new Date(prev.time).getDate()){
              return undefined;
            }

            return time.date(d);
          };

          $scope.firstNewMessage = function (msg, index){
            // There is not access record
            if (! $scope.project.getTimestampAccess().chat) {
              return false;
            }

            var previousAccess = $scope.project.getTimestampAccess().chat.prev;

            // There is not previous access
            if (! previousAccess) {
              return false;
            }

            previousAccess = new Date(previousAccess);

            var prevMsg = prevMessage(index);

            // There are not more messages
            if (! prevMsg) {
              return false;
            }

            var date = new Date(msg.time);

            if (date > previousAccess && previousAccess > new Date(prevMsg.time)){
                return true;
            }

            return false;
          };

          $scope.keyDown = function(event){
            if (event.which === 13) {
              // Input model is only updated on blur, so we have to sync manually
              $scope.chatForm.chatInput.$commitViewValue();

              $scope.send();

              event.preventDefault();
            }
          };
        }
      ],
      templateUrl: 'chat.html'
    };
  });
