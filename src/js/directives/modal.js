'use strict';

angular.module('Teem')
  .directive('modal', ['SharedState', function(SharedState) {
    return {
      templateUrl: 'modal.html',
      transclude: {
        header: 'header',
        main: 'main',
        footer: 'footer'
      },
      scope: {
        name: '@'
      },
      link: function($scope, $element, $attrs) {
        if (!$attrs.name) {
          throw Error('Provide a name to the modal please.');
        }
        $scope.isModalSharedState = function() {
          let modalSharedState = SharedState.get('modalSharedState');
          return modalSharedState && (modalSharedState === $scope.name ||
            modalSharedState.name === $scope.name);
        };

        $scope.keyUp = function(event){
          if(event.which === 27){
            SharedState.turnOff('modalSharedState');
          }
        };
      }
    };
  }]);
