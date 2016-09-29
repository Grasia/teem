'use strict';

angular.module('Teem')
  .filter('idToNick', function() {
    return function(id = '') {
      return id.split('@')[0];
    };
  });
