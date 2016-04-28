'use strict';

/**
 * @ngdoc filter
 * @name links
 * @kind function
 *
 * @description
 * Like angular's bundled linky filter, but opens external links in a new tab.
 */
angular.module('Teem')
  .filter('links', ['linkyFilter', function(linkyFilter) {
    return function(input = '') {
      var a = document.createElement('a');
      return linkyFilter(input, undefined, function(url) {
        a.href = url;
        var isExternal = (a.host !== window.location.host);
        return isExternal ? {target: '_blank'} : null;
      });
    };
  }]);
