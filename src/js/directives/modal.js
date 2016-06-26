'use strict';

angular.module('Teem')
  .directive('modal', ['SharedState', function(SharedState) {
    return {
      templateUrl: 'modal.html',
      restrict: 'E',
      transclude: {
        header: 'header',
        main: 'main',
        footer: 'footer'
      },
      scope: true,
      link: function($scope, $element, $attrs) {
        if (!$attrs.name) {
          throw Error('Provide a name to the modal please.');
        }

        $scope.overlay = $attrs.overlay;

        $scope.isModalSharedState = function() {
          let modalSharedState = SharedState.get('modalSharedState');
          return modalSharedState && (modalSharedState === $attrs.name ||
            modalSharedState.name === $attrs.name);
        };

        $scope.keyUp = function(event){
          if(event.which === 27){
            SharedState.turnOff('modalSharedState');
          }
        };
      }
    };
  }]);
