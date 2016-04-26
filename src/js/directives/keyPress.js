'use strict';

angular.module('Teem')
  .directive('keyPress',['$document', function($document) {
    return {
      scope: true,
      link: function(scope, element) {
       $document.on('keyup', function (event){
          scope.$apply(scope.keyUp(event));
        });
      }
    };
  }]);
   