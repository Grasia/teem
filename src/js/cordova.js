'use strict';
angular.element(document).ready(function () {
  // Load only within android app: cordova=android
  if (window.location.search.search('cordova') > 0) {
    (function(d, script) {
      // When device comes to foreground
      function onResume() {
        if (window.applicationCache) {
          window.applicationCache.update();
        }
      }

      // Device APIs are available
      function onDeviceReady() {
        angular.bootstrap(document.documentElement, ['Teem']);
        d.addEventListener('resume', onResume, false);
        console.log('deviceReady');
        window.plugins.intent.getCordovaIntent(function (intent) {
          console.log('getCordovaIntent');
          console.log(intent);
          if (intent.data) {
            window.location = intent.data;
          }
        }, function () {
            console.log('Error');
        });
        window.plugins.intent.setNewIntentHandler(function (intent) {
          console.log('setNewIntnetHandler');
          console.log(intent);
          if(intent.data) {
            window.location = intent.data;
          }
        });
      }

      // When cordova is loaded
      function onLoad() {
        d.addEventListener('deviceready', onDeviceReady, false);
      }

      script = d.createElement('script');
      script.onload = onLoad;
      script.type = 'text/javascript';
      script.src = 'js/cordova/cordova.js';
      d.getElementsByTagName('head')[0].appendChild(script);
    }(document));
  } else {
    angular.bootstrap(document.documentElement, ['Teem']);
  }
});
