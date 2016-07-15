'use strict';

angular.module('Teem')
  .directive('like', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SessionSvc', '$timeout', 'ProjectsSvc', '$route',
      function($scope, $element, $attrs, SessionSvc, $timeout, ProjectsSvc, $route) {
        $scope.likeIcon = $attrs.likeIcon;
        $scope.likeCount = $attrs.likeCount;
        $scope.likeCopyOn  = $attrs.likeCopyOn;
        $scope.likeCopyOff = $attrs.likeCopyOff;

        $element.on('click', function() {
          var previousLike = $scope.project.isSupporter();
          SessionSvc.loginRequired($scope, function() {
            if (previousLike === $scope.project.isSupporter()){
              $scope.project.toggleSupport();
              $timeout();
            }
          }, undefined, $scope.project.synchPromise());
        });
      }],
      templateUrl: 'like.html'
    };
  });
