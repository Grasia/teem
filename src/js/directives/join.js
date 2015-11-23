'use strict';

angular.module('Pear2Pear')
  .directive('join', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SwellRTSession', '$timeout',
      function($scope, $element, $attrs, SwellRTSession, $timeout) {
        $scope.joinIcon = $attrs.joinIcon;
        $scope.joinCopyOn  = $attrs.joinCopyOn;
        $scope.joinCopyOff = $attrs.joinCopyOff;

        $element.on('click', function() {
          SwellRTSession.loginRequired(function() {
            $scope.project.toggleContributor();
            $timeout();
          });
        });
      }],
      templateUrl: 'join.html'
    };
  });
