'use strict';

angular.module('Teem')
  .directive('join', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SessionSvc', '$timeout', '$analytics', 'SharedState',
      function($scope, $element, $attrs, SessionSvc, $timeout, $analytics, SharedState) {

        $scope.joinIcon = $attrs.joinIcon;
        $scope.joinCopyOn  = $attrs.joinCopyOn;
        $scope.joinCopyOff = $attrs.joinCopyOff;

        $element.on('click', function() {

          if (!$scope.project.isParticipant()){
            if ($attrs.joinModal) {
              SharedState.set('modalSharedState', { name: 'join' });
            } else {
              SessionSvc.loginRequired($scope, function() {
                $scope.project.addParticipant();
              }, undefined, $scope.project.synchPromise());
            }

            $timeout();
            $analytics.eventTrack('Join project', {});
          } else {

            SessionSvc.loginRequired($scope, function() {
              $scope.project.removeParticipant();
            }, undefined, $scope.project.synchPromise());
          }
        });
      }],
      templateUrl: 'join.html'
    };
  });
