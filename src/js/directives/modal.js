'use strict';

angular.module('Teem')
  .directive('modal', ['SharedState', function(SharedState) {
    return {
      templateUrl: 'modal.html',
      restrict: 'E',
      transclude: {
        header: '?header',
        main: '?main',
        footer: '?footer'
      },
      scope: true,
      link: function($scope, $element, $attrs) {
        if (!$attrs.name) {
          throw Error('Provide a name to the modal please.');
        }

        var sharedStateName = 'modal.' + $attrs.name;

        $scope.overlay = $attrs.overlay;
        $scope.sharedStateName = sharedStateName;

        SharedState.initialize($scope, sharedStateName);

        $scope.isModalSharedState = function() {
          return SharedState.get(sharedStateName);
        };

        $scope.keyUp = function(event){
          if(event.which === 27){
            SharedState.turnOff(sharedStateName);
          }
        };
      }
    };
  }]);
