'use strict';

(function(d) {
  var sourceUrl =
   d.getElementById('teem-wjs')
    .getAttribute('src')
    .split('js/widgets.js')[0];

  var projects = d.querySelectorAll('.teem-project');

  function buildProject(e) {
    var projectId,
        iframe = d.createElement('iframe');
    iframe.style.border = 'none';
    iframe.width = '100%';
    iframe.height = '100%';

    projectId = e.getAttribute('data-id');

    iframe.setAttribute('src', sourceUrl + 'widget.html#/projects/' + projectId);

    e.appendChild(iframe);
  }

  for (var i = 0; i < projects.length; i++) {
    buildProject(projects[i]);
  }
})(document);
