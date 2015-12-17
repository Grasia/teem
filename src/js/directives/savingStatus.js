'use strict';

angular.module('Teem')
  .directive('savingStatus', [
  'SessionSvc', '$timeout',
  function(SessionSvc, $timeout) {
    return {
      link: function(scope, element) {
        element.on('focus', function() {
          SessionSvc.showSaving = true;

          $timeout();
        }).
        on('blur', function() {
          SessionSvc.showSaving = false;

          $timeout();
        });
      }
    };
  }]);
