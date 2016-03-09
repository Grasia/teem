'use strict';

angular.module('Teem')
  .directive('participate', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SessionSvc', '$timeout',
      function($scope, $element, $attrs, SessionSvc, $timeout) {
        $scope.participateCopyOn  = $attrs.participateCopyOn;
        $scope.participateCopyOff = $attrs.participateCopyOff;

        $element.on('click', function() {
          SessionSvc.loginRequired($scope, function() {
            $scope.community.toggleParticipant();
            $timeout();
          });
        });
      }],
      templateUrl: 'participate.html'
    };
  });
