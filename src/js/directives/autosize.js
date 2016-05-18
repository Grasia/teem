'use strict';

// Directive for using http://www.jacklmoore.com/autosize/
angular.module('Teem')
  .directive('autosize',[
  function() {
    return {
      link: function(scope, element) {
        autosize(element);
      }
    };
  }]);
