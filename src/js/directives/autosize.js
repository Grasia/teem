'use strict';

// Directive for using http://www.jacklmoore.com/autosize/
angular.module('Teem')
  .directive('autosize',[
  '$timeout',
  function($timeout) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        autosize(element);

        scope.$watch(function() {
           return ngModel.$modelValue;
         }, function() {
           $timeout(() => {
             autosize.update(element);
           });
         });
      }
    };
  }]);
