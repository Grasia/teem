'use strict';

angular.module('Teem')
  .directive('keyPress',['$document', function($document) {
    return {
      scope: true,
      link: function(scope, element,attr) {
       $document.on(attr.keyPress, function (event){
          scope.$apply(scope.keyUp(event));
        });
      }
    };
  }]);
   