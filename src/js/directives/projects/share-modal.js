'use strict';

angular.module('Teem')
  .directive('projectsShareModal', function() {
    return {
      controller: ['$scope', function($scope) {
        $scope.clipboardMessage = 'copy';
      }],
      templateUrl: 'projects/share-modal.html'
    };
  });
