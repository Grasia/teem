'use strict';

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = window.swellrtConfig.server + '/swellrt/swellrt.nocache.js';
document.getElementsByTagName('head')[0].appendChild(script);
