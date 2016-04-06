
'use strict';

angular.module('Teem')
  .directive('walkthrough', [
  '$cookies', function($cookies) {
    return {
      controller: ['$scope', function($scope) {
        $scope.close = function() {
          $scope.walkthrough = false;
          var expires = 'Tue, 19 Jan 2038 03:14:07 UTC'; // https://en.wikipedia.org/wiki/Year_2038_problem
          $cookies.put('walkthrough', 'true', {expires});
        };
      }],
      scope: true,
      link: function(scope) {
        if (!$cookies.get('walkthrough')) {
          scope.walkthrough = true;
        }
      },
      templateUrl: 'walkthrough.html'
    };
  }]);
