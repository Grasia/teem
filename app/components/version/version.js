'use strict';

angular.module('Pear2Pear.version', [
  'Pear2Pear.version.interpolate-filter',
  'Pear2Pear.version.version-directive'
])

.value('version', '0.1');
