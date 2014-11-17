'use strict';

// Load only within android app: cordova=android
if (window.location.search.search('cordova') > 0) {
  (function(d, script) {
    var scripts = [ 'cordova', 'cordova_plugins' ];

    for (var i in scripts) {
      script = d.createElement('script');
      script.type = 'text/javascript';
      script.src = 'scripts/cordova/' + scripts[i] + '.js';
      d.getElementsByTagName('head')[0].appendChild(script);
    }
  }(document));
}
