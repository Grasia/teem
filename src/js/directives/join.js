'use strict';

angular.module('Teem')
  .directive('join', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SessionSvc', '$timeout',
      function($scope, $element, $attrs, SessionSvc, $timeout) {
        $scope.joinIcon = $attrs.joinIcon;
        $scope.joinCopyOn  = $attrs.joinCopyOn;
        $scope.joinCopyOff = $attrs.joinCopyOff;

        $element.on('click', function() {
          SessionSvc.loginRequired(function() {
            $scope.project.toggleContributor();
            $timeout();
          });
        });
      }],
      templateUrl: 'join.html'
    };
  });
