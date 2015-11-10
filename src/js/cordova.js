'use strict';

// Load only within android app: cordova=android
if (window.location.search.search('cordova') > 0) {
  (function(d, script) {
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.src = 'js/cordova/cordova.js';
    d.getElementsByTagName('head')[0].appendChild(script);
  }(document));
}
