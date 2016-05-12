'use strict';

angular.module('Teem')
  .directive('join', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SessionSvc', '$timeout', '$analytics',
      function($scope, $element, $attrs, SessionSvc, $timeout, $analytics) {
        $scope.joinIcon = $attrs.joinIcon;
        $scope.joinCopyOn  = $attrs.joinCopyOn;
        $scope.joinCopyOff = $attrs.joinCopyOff;

        $element.on('click', function() {
          SessionSvc.loginRequired($scope, function() {
            if (!$scope.project.isParticipant()) {
              $analytics.eventTrack('Join project');
            }

            $scope.project.toggleParticipant();
            $timeout();
          });
        });
      }],
      templateUrl: 'join.html'
    };
  });
