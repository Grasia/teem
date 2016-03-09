'use strict';

angular.module('Teem')
// https://yearofmoo.github.io/ngMessages/
.directive('matchValidator', function() {
  return {
    require: 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        ngModel.$setValidity('match', value === scope.$eval(attrs.matchValidator));
        return value;
      });
    }
  };
});
