'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the Pear2Pear
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/communities/:id/projects', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      });
  }])
  .controller('ProjectsCtrl', ['pear', '$scope', '$location', '$route', function (pear, $scope, $location, $route) {

    pear.onLoad(function(){
      $scope.community = pear.communities.find($route.current.params.id);

      $scope.projects = pear.projects.all();

      $scope.new_ = function () {
        pear.projects.create(function(p) {
          $location.path('/projects/' + p.id + '/pad/');
        });
      };

      $scope.destroy = function(id) {
        pear.projects.destroy(id);
      };
    });

    $scope.showProjectChat = function (id) {
      $location.path('/projects/' + id + '/chat/');
    };

    // This function should belong to the model
    // In the prototype or something similar
    $scope.progressPercentage = function(project) {
      var size,
          completed = 0;

      if (project.needs === undefined) {
        return 0;
      }

      size = project.needs.length;

      if (size === 0) {
        return 0;
      }

      angular.forEach(project.needs, function(need) {
        if (need.completed === 'true') {
          completed++;
        }
      });

      return completed * 100 / size;
    };

    $scope.progressType = function(project) {
      var percentage = $scope.progressPercentage(project);

      if (percentage < 33) {
        return 'danger';
      } else if (percentage > 66) {
        return 'success';
      } else {
        return 'warning';
      }
    };
  }]);
