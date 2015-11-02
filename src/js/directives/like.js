'use strict';

angular.module('Pear2Pear')
  .directive('like', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SwellRTSession', 'SharedState',
      function($scope, $element, $attrs, SwellRTSession, SharedState) {
        $scope.likeIcon = $attrs.likeIcon;
        $scope.likeCopyOn  = $attrs.likeCopyOn;
        $scope.likeCopyOff = $attrs.likeCopyOff;

        $element.on('click', function() {
          if (! SwellRTSession.users.loggedIn()) {
            SharedState.turnOn('shouldLoginSharedState');
            return;
          }

          $scope.project.toggleSupport();
          $scope.$apply();
        });
      }],
      templateUrl: 'like.html'
    };
  });
