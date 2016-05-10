
'use strict';

angular.module('Teem')
  .directive('needWidget', function() {
    return {
      scope: {},
      controller: [
      '$scope',
      function($scope) {
        $scope.toggleCompleted = function (need, event) {
          event.stopPropagation();
          // Needed by the magic of material design
          event.preventDefault();

          $scope.project.toggleNeedCompleted(need);
        };
      }],
      templateUrl: 'pad/need-widget.html'
    };
  });
