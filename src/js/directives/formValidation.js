'use strict';

angular.module('Teem')
.directive('availableNick', function() {
  //TODO
})
.directive('validationError', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctl) {
      scope.$watch(attrs.validationError, function (errorMsg) {
        console.log(errorMsg);
        elm[0].setCustomValidity(errorMsg || '');
        ctl.$setValidity('validationError', !errorMsg);
      });
    }
  };
});
