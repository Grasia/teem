'use strict';

angular.module('Teem')
  .directive('projectPeople', function() {
    return {
      scope: true,
      controller: [
        'SessionSvc', '$scope', '$location',
        function (SessionSvc, $scope, $location) {
      }],
      templateUrl: 'projects/project-people.html'
    };
  });
