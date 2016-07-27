'use strict';

angular.module('Teem')
  .directive('confirmModal', function() {
    return {
      controller: ['$scope', 'SharedState', function($scope, SharedState) {
        let cb;

        $scope.$on('mobile-angular-ui.state.changed.modalSharedState', function(e, newValue) {
          $scope.confirmTitle = newValue && newValue.title;
          $scope.confirmText = newValue && newValue.text;
          cb = newValue && newValue.callback;
        });

        $scope.confirm = function() {
          if(cb) {
            cb();
          }
          SharedState.turnOff('modalSharedState');
        };
        $scope.cancel = function() {
          SharedState.turnOff('modalSharedState');
        };
      }],
      templateUrl: 'confirm-modal.html'
    };
  });
