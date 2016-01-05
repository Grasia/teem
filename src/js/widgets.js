'use strict';

(function(d) {
  var sourceUrl =
   d.getElementById('teem-wjs')
    .getAttribute('src')
    .split('js/widgets.js')[0];

  var projects = d.querySelectorAll('.teem-project');

  function buildProject(div) {
    var iframe = d.createElement('iframe');
    iframe.setAttribute('src', sourceUrl + 'widget.html#/communities/bG9jYWwubmV0L3MrNjl1OE5KV1NZUUE/projects/bG9jYWwubmV0L3MralJKWU90V3JOaEE/pad');
    iframe.style.border = 'none';
    iframe.width = '100%';
    iframe.height = '100%';

    div.appendChild(iframe);
  }

  for (var i = 0; i < projects.length; i++) {
    buildProject(projects[i]);
  }
})(document);
