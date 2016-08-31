'use strict';

/* Fixes floating-labels for bootstrap-material-design
* Source: https://github.com/FezVrasta/bootstrap-material-design/issues/148#issuecomment-150169488
*/

angular.module('Teem')
  .directive('ngModel',['$timeout', function($timeout){
    return {
      restrict: 'A',
      priority: -1, // lower priority than built-in ng-model so it runs first
      link: function(scope, element, attr) {
        scope.$watch(attr.ngModel,function(value){
          $timeout(function () {
            if (value){
              element.trigger('change');
            }
          });
        });
      }
    };
  }]);
