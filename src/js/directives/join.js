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

            if (!$scope.project.isContributor()) {
              $analytics.eventTrack('Join project');
            }

            $scope.project.toggleContributor();
            $timeout();
          });
        });
      }],
      templateUrl: 'join.html'
    };
  });
