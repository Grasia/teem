'use strict';

// Directive for using http://www.jacklmoore.com/autosize/
angular.module('Teem')
  .directive('textfit',[
  '$timeout',
  function($timeout) {
    return {
      link: function(scope, element, attrs) {
        scope.$watch(attrs.ngBind, function() {
         $timeout(() => {
           textFit(element);
         }, 1000); // There should be a better way to do this :-(
       });
      }
    };
  }]);
