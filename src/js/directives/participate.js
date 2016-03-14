'use strict';

angular.module('Teem')
  .directive('participate', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SessionSvc', '$timeout', 'CommunitiesSvc',
      function($scope, $element, $attrs, SessionSvc, $timeout, CommunitiesSvc) {
        $scope.participateCopyOn  = $attrs.participateCopyOn;
        $scope.participateCopyOff = $attrs.participateCopyOff;
        
        $element.on('click', function($event) {
          SessionSvc.loginRequired($scope, function() {
            if ($scope.community.toggleParticipant) {
              $timeout(function() {
                $scope.community.toggleParticipant();
              });
            } else {
              CommunitiesSvc.find($scope.community.id).then(function(community) {
                $timeout(function() {
                  community.toggleParticipant();
                  $scope.community.participants = community.participants;
                });
              });
            }
          });
          $event.stopPropagation();
        });
      }],
      templateUrl: 'participate.html'
    };
  });
