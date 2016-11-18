'use strict';

angular.module('Teem')
  .directive('join', function() {
    return {
      controller: [
      '$scope', '$element', 'SessionSvc', '$timeout', '$analytics', 'SharedState', '$routeParams',
      function($scope, $element, SessionSvc, $timeout, $analytics, SharedState, $routeParams) {

        $element.on('click', function() {

          if (!$scope.project.isParticipant()){

            var origin = $routeParams.origin;
            console.log($routeParams);

            if ($scope.joinModal && typeof origin === 'undefined') {
              SharedState.set('modal.join', { name: 'join' });
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
      scope: {
        joinIcon: '@',
        joinCopyOn: '@',
        joinCopyOff: '@',
        joinModal: '=',
        project: '=joinModel'
      },
      templateUrl: 'join.html'
    };
  });
