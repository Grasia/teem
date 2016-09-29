'use strict';

angular.module('Teem')
  .directive('confirmModal', function() {
    return {
      controller: ['$scope', 'SharedState', function($scope, SharedState) {
        let cb;

        $scope.$on('mobile-angular-ui.state.changed.modal.confirm', function(e, newValue) {
          $scope.confirmTitle = newValue && newValue.title;
          $scope.confirmText = newValue && newValue.text;
          $scope.confirmAccept = newValue && newValue.accept;
          $scope.confirmCancel = newValue && newValue.cancel;

          cb = newValue && newValue.callback;
        });

        $scope.confirm = function() {
          if(cb) {
            cb();
          }
          SharedState.turnOff('modal.confirm');
        };
        $scope.cancel = function() {
          SharedState.turnOff('modal.confirm');
        };
      }],
      templateUrl: 'confirm-modal.html'
    };
  });
