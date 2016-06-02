'use strict';

angular.module('Teem')
  .directive('chatPictureModal', function() {
    return {
      controller: ['$scope', 'SharedState', function($scope, SharedState) {
        $scope.getChatPictureUrl = function() {
          return SharedState.get('chatPictureSharedState');
        };
      }],
      templateUrl: 'chat/chat-picture-modal.html'
    };
  });
