'use strict';

angular.module('Pear2Pear')
  .directive('join', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SwellRTSession',
      function($scope, $element, $attrs, SwellRTSession) {
        $scope.joinIcon = $attrs.joinIcon;
        $scope.joinCopyOn  = $attrs.joinCopyOn;
        $scope.joinCopyOff = $attrs.joinCopyOff;

        $element.on('click', function() {
          SwellRTSession.loginRequired(function() {
            $scope.project.toggleContributor();
            $scope.$apply();
          });
        });
      }],
      templateUrl: 'join.html'
    };
  });
