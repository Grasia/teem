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
          return SharedState.eq('modalSharedState', $scope.name);
        };
      }
    };
  }]);
