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
              ProjectsSvc.findByUrlId($route.current.params.id).then(function(project){

                if (previousLike === project.isSupporter()){
                  project.toggleSupport();
                  $timeout();
                }
              });
          });

        });
      }],
      templateUrl: 'like.html'
    };
  });
