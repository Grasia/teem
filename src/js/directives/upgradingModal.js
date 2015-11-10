
'use strict';

angular.module('Pear2Pear')
  .directive('upgradingModal', [
  '$window', '$timeout',
  function($window, $timeout) {
    return {
      scope: true,
      link: function(scope){
        var appCache = $window.applicationCache;

        // Browsers not supporting Application Cache
        if (!appCache) {
          return;
        }

        appCache.addEventListener('downloading', function() {
          scope.upgrading = true;
        });

        appCache.addEventListener('cached', function() {
          scope.upgrading = false;
          // Need to apply scope
          $timeout();
        });

        appCache.addEventListener('error', function() {
          scope.upgrading = false;
          // Need to apply scope
          $timeout();
        });

        appCache.addEventListener('updateready', function() {
          scope.upgrading = false;
          // Need to apply scope
          $timeout(function() {
            appCache.swapCache();
            $window.location.reload();
          });
        });
      },
      templateUrl: 'upgrading-modal.html'
    };
  }]);
