'use strict';

angular.module('Teem')
  .directive('chatPictureModal', function() {
    return {
      controller: ['$scope', 'SharedState', function($scope, SharedState) {
        $scope.getChatPictureUrl = function() {
          let modalSharedState = SharedState.get('modal.chatPicture');
          return modalSharedState && modalSharedState.url;
        };
      }],
      templateUrl: 'chat/chat-picture-modal.html'
    };
  });
