'use strict';

angular.module('Pear2Pear')
  .directive('likeJoin', function() {
    return {
      require: 'project',
      scope: {
        project: '=' 
      },
      controller: ['$scope', 'SwellRTSession', 'SharedState', function($scope, SwellRTSession, SharedState){

        $scope.toggleContributor = function(){
          if (! SwellRTSession.users.loggedIn()) {
            SharedState.turnOn('shouldLoginSharedState');
            return;
          }

          $scope.project.toggleContributor();

        };

        $scope.toggleSupport = function(){
          if (! SwellRTSession.users.loggedIn()) {
            SharedState.turnOn('shouldLoginSharedState');
            return;
          }

          $scope.project.toggleSupport();

        };
      }],
      templateUrl: 'like-join.html'
    }
  });
