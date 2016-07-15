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
        var previousJoinState;

        $element.on('click', function() {

          previousJoinState = $scope.project.isParticipant();

          SessionSvc.loginRequired($scope, function() {
            if (!previousJoinState){
              if (!$scope.project.isParticipant()){
                $scope.project.addParticipant();
                $analytics.eventTrack('Join project', {});
              }
            } else {
              $scope.project.removeParticipant();
            }
          }, undefined, $scope.project.synchPromise());
        });
      }],
      templateUrl: 'join.html'
    };
  });
