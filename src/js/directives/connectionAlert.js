'use strict';

angular.module('Pear2Pear')
  .directive('connectionAlert', function() {
    return {
      controller: ['$scope', 'SwellRTSession', function($scope, SwellRTSession){
        $scope.connected = function(){
          return SwellRTSession.status.isConnected() || !SwellRTSession.users.loggedIn();
        };
        $scope.sync = SwellRTSession.status.isDataSync;
        $scope.lastDataSync = SwellRTSession.status.lastDataSync;
      }],
      templateUrl: 'connection-alert.html'
    }
  });
