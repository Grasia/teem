
'use strict';

angular.module('Pear2Pear')
  .directive('upgradingModal', [
  'SharedState', '$window',
  function(SharedState, $window) {
    return {
      link: function(){
        var appCache = $window.applicationCache;

        // Browsers not supporting Application Cache
        if (!appCache) {
          return;
        }

        appCache.addEventListener('downloading', function() {
          SharedState.turnOn('upgradingSharedState');
        });

        appCache.addEventListener('cached', function() {
          SharedState.turnOff('upgradingSharedState');
        });

        appCache.addEventListener('updateready', function() {
          SharedState.turnOff('upgradingSharedState');
          appCache.swapCache();
        });
      },
      templateUrl: 'upgrading-modal.html'
    };
  }]);
