'use strict';

angular.module('Pear2Pear')
  .directive('join', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SwellRTSession', 'SharedState',
      function($scope, $element, $attrs, SwellRTSession, SharedState) {
        $scope.joinIcon = $attrs.joinIcon;
        $scope.joinCopyOn  = $attrs.joinCopyOn;
        $scope.joinCopyOff = $attrs.joinCopyOff;

        $element.on('click', function() {
          if (! SwellRTSession.users.loggedIn()) {
            SharedState.turnOn('shouldLoginSharedState');
            return;
          }

          $scope.project.toggleContributor();
          $scope.$apply();
        });
      }],
      templateUrl: 'join.html'
    };
  });
