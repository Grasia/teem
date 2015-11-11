'use strict';

angular.module('Pear2Pear')
  .directive('like', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SwellRTSession', '$timeout',
      function($scope, $element, $attrs, SwellRTSession, $timeout) {
        $scope.likeIcon = $attrs.likeIcon;
        $scope.likeCopyOn  = $attrs.likeCopyOn;
        $scope.likeCopyOff = $attrs.likeCopyOff;

        $element.on('click', function() {
          SwellRTSession.loginRequired(function() {
            $scope.project.toggleSupport();
            $scope.$apply();
          });

        });
      }],
      templateUrl: 'like.html'
    };
  });
