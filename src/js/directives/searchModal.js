'use strict';

angular.module('Teem')
  .directive('searchModal', function() {
    return {
      controller:  ['$scope', function($scope){
        $scope.search = {
          input: ''
        };
      }],
      templateUrl: 'search-modal.html'
    };
  });
