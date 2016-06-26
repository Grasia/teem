'use strict';

angular.module('Teem')
  .directive('sessionModal', function() {
    return {
      controller: 'SessionCtrl',
      templateUrl: 'session/modal.html'
    };
  });
