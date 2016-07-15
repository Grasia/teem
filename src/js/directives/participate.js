'use strict';

angular.module('Teem')
  .directive('participate', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SessionSvc',
      function($scope, $element, $attrs, SessionSvc) {
        $scope.participateCopyOn  = $attrs.participateCopyOn;
        $scope.participateCopyOff = $attrs.participateCopyOff;
        var previousJoinState;

        $element.on('click', function() {

            previousJoinState = $scope.community.isParticipant();

            SessionSvc.loginRequired($scope, function() {
              if (!previousJoinState){
                if (!$scope.community.isParticipant()){
                  $scope.community.addParticipant();
                }
              } else {
                $scope.community.removeParticipant();
              }
            }, undefined, $scope.community.synchPromise());
        });
      }],
      templateUrl: 'participate.html'
    };
  });
