'use strict';

angular.module('Teem')
  .directive('confirmModal', function() {
    return {
      controller: ['$scope', 'ModalsSvc', function($scope, ModalsSvc) {
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
          ModalsSvc.turnOff('modal.confirm');
        };
        $scope.cancel = function() {
          ModalsSvc.turnOff('modal.confirm');
        };
      }],
      templateUrl: 'confirm-modal.html'
    };
  });
