'use strict';

angular.module('Pear2Pear')
  .directive('savingStatus', [
  'SessionSvc', '$timeout',
  function(SessionSvc, $timeout) {
    return {
      link: function(scope, element) {
        element.on('focus', function() {
          console.log('ea');
          SessionSvc.showSaving = true;

          $timeout();
        }).
        on('blur', function() {
          console.log('ae');
          SessionSvc.showSaving = false;

          $timeout();
        });
      }
    };
  }]);
