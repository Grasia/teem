'use strict';

angular.module('Pear2Pear')
  .directive('connectionStatus', function() {
    return {
      scope: true,
      controller: [
      '$scope', 'SwellRTSession', '$window', '$timeout',
      function($scope, SwellRTSession, $window, $timeout){
        var saveTimeout;

        function showSave() {
          $scope.status.saved = true;

          saveTimeout = $timeout(function() {
            hideSave();
          }, 3000);
        }

        function hideSave() {
          $timeout.cancel(saveTimeout);
          saveTimeout = undefined;

          $scope.status.saved = false;
        }

        $scope.status = {
          connected: false,
          disconnected: false,
          desync: false
        };

        $scope.$watchCollection(function() {
          return SwellRTSession.status;
        }, function(current, former) {
          // Always reset saved state
          if ($scope.status.saved) {
            hideSave();
          }

          $scope.status.connected    = current.connection === 'connected';
          $scope.status.disconnected = current.connection === 'disconnected';
          $scope.status.desync = ! current.sync;
          $scope.status.lastSync = current.lastSync;

          if (current.connection === 'connected' &&
              current.sync &&
              ! former.sync) {
            showSave();
          }
        });

        $scope.refresh = function(){
          console.log('reload', $window.location);
          $window.location.reload();
        };
      }],
      templateUrl: 'connection-status.html'
    };
  });
