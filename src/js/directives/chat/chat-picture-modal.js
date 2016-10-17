'use strict';

angular.module('Teem')
  .directive('chatPictureModal', function() {
    return {
      controller: ['$scope', 'ModalsSvc', function($scope, ModalsSvc) {
        $scope.getChatPictureUrl = function() {
          let modalModalsSvc = ModalsSvc.get('modal.chatPicture');
          return modalModalsSvc && modalModalsSvc.url;
        };
      }],
      templateUrl: 'chat/chat-picture-modal.html'
    };
  });
