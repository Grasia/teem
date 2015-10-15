'use strict';

angular.module('Pear2Pear')
  .directive('connectionAlert', function() {
    return {
      controller: ['$scope', 'SwellRTSession', '$window', function($scope, SwellRTSession, $window){
        $scope.connected = function(){
          return SwellRTSession.status.isConnected() || !SwellRTSession.users.loggedIn();
        };
        $scope.sync = SwellRTSession.status.isDataSync;
        $scope.lastDataSync = SwellRTSession.status.lastDataSync;

        $scope.refresh = function(){
          console.log('reload', $window.location);
          $window.location.reload();
        };

      }],
      templateUrl: 'connection-alert.html'
    };
  });
