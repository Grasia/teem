'use strict';

angular.module('Teem')
  .directive('join', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SessionSvc', '$timeout', '$analytics', 'ProjectsSvc', '$route',
      function($scope, $element, $attrs, SessionSvc, $timeout, $analytics, ProjectsSvc, $route) {
        $scope.joinIcon = $attrs.joinIcon;
        $scope.joinCopyOn  = $attrs.joinCopyOn;
        $scope.joinCopyOff = $attrs.joinCopyOff;
        var previousJoinState;

        $element.on('click', function() {
          previousJoinState = $scope.project.isParticipant();
          SessionSvc.loginRequired($scope, function() {
            ProjectsSvc.findByUrlId($route.current.params.id).then(function(project){
              if (!previousJoinState){
                if (!project.isParticipant()){
                  project.addParticipant();
                  $analytics.eventTrack('Join project', {});
                }
              } else {
                project.removeParticipant();
              }
            });
          });
        });
      }],
      templateUrl: 'join.html'
    };
  });
