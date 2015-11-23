'use strict';

angular.module('Pear2Pear')
  .directive('participate', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SwellRTSession', '$timeout',
      function($scope, $element, $attrs, SwellRTSession, $timeout) {
        $scope.participateCopyOn  = $attrs.participateCopyOn;
        $scope.participateCopyOff = $attrs.participateCopyOff;

        $element.on('click', function() {
          SwellRTSession.loginRequired(function() {
            $scope.community.toggleParticipant();
            $timeout();
          });
        });
      }],
      templateUrl: 'participate.html'
    };
  });
