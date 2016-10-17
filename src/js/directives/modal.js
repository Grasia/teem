'use strict';

angular.module('Teem')
  .directive('modal', ['ModalsSvc', function(ModalsSvc) {
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

        ModalsSvc.initialize($scope, sharedStateName);

        $scope.isModalModalsSvc = function() {
          return ModalsSvc.get(sharedStateName);
        };

        $scope.test = () => {
          console.log('ey');
        };

        $scope.keyUp = function(event){
          if(event.which === 27){
            ModalsSvc.turnOff(sharedStateName);
          }
        };
      }
    };
  }]);
