'use strict';

angular.module('Teem')
  .directive('projectPeople', function() {
    return {
      scope: true,
      templateUrl: 'projects/project-people.html'
    };
  });
