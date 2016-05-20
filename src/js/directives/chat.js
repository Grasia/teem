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
  .directive('chat', ['Notification', function(Notification) {
    return {
      controller: [
        'SessionSvc', '$scope', '$rootScope', '$route', '$location',
        '$animate', 'time', '$timeout',
        function(SessionSvc, $scope, $rootScope, $route, $location,
        $animate, time, $timeout){
          const pageSize = 20;
          const CAMERA_SYMBOL = '\uD83D\uDCF7';
          // For scrolling in chatScroll directive
          $scope.defaultPageSize = pageSize;
          $scope.pageSize = pageSize;
          $scope.pageOffset = - pageSize;
          $scope.newMsg = '';

          var chatTextarea = document.querySelector('.chat-textarea');
          var sendBtn = document.getElementById('chatSendBtn');
          var uploadBtn = document.getElementById('chatUploadBtn');

          $scope.nextPage = function() {
            if ($scope.project.chat.length > $scope.pageSize) {
              $scope.pageSize += pageSize;
              $scope.pageOffset -= pageSize;
            }
          };

          //For scrolling to bottom on input focus
          $scope.scrollToBottom = function(){

            var chatMessages = document.getElementsByClassName('chat-message');

            if(chatMessages.length > 0){

              var lastMessage = chatMessages[chatMessages.length - 1];
              var scrollableContentController = angular.element(lastMessage).controller('scrollableContent');
              $timeout(function(){
                scrollableContentController.scrollTo(lastMessage);
              }, 200);
            }
          };

          // Send button
          $scope.send = function(){
            var msg = chatTextarea.value.trim();

            if (msg === '') {
              return;
            }

            $scope.project.addChatMessage(msg);

            chatTextarea.value = '';
            angular.element(chatTextarea).trigger('input');
            autosize.update(chatTextarea);

            chatTextarea.click();
          };

          $scope.standpoint = function(msg){
            if (!SessionSvc.users.current()) {
              return msg.standpoint || 'their';
            }
            return msg.standpoint || (SessionSvc.users.isCurrent(msg.who) ? 'mine' : 'their');
          };

          // TODO: delete notification messages
          $scope.isNotificationMessage = function(msg){
            return $scope.standpoint(msg) === 'notification';
          };


          $scope.hour = function(msg) {
            return time.hour(new Date(msg.time));
          };

          $scope.showPad = function() {
            $location.path($scope.project.path() + '/pad');
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

          angular.element(chatTextarea).on('input', function() {
            uploadBtn.classList.toggle('hidden', chatTextarea.value);
            sendBtn.classList.toggle('hidden', !chatTextarea.value);
          });

          $scope.keyDown = function(event){
            if (event.which === 13) {
              $scope.send();
              event.preventDefault();
            }
          };

          $scope.uploadFile = function(file) {
            if (!file) {
              return;
            }
            if (!file.type || !file.type.startsWith('image/')) {
              Notification.error('chat.upload.noImg');
              return;
            }
            if (file.size > 4 * 1024 * 1024) { // 4MB
              Notification.error('chat.upload.tooLarge');
              return;
            }
            $scope.project.addChatMessage(CAMERA_SYMBOL, file);
            });
          };
        }
      ],
      templateUrl: 'chat.html'
    };
  }]);
