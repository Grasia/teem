'use strict';

class EmptyTipModalCtrl {

  constructor ($scope, $timeout){
    'ngInject';

    $scope.$on('mobile-angular-ui.state.changed.modal.padEmptyTip', function(e, newValue) {
      $scope.step = newValue.step;
    });

    this.$scope = $scope;
    this.$timeout = $timeout;

    $scope.step = 'participate';
  }
}

angular.module('Teem').
  component('padEmptyTipModal', {
    controller: EmptyTipModalCtrl,
    templateUrl: 'pad/empty-tip-modal.html'
  });
