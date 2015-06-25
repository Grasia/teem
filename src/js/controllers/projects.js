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
      .when('/projects', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      })
      .when('/projects/:id/tasks', {
        templateUrl: 'projects/show.html',
        controller: 'ProjectsCtrl'
      });
  }])
  .controller('ProjectsCtrl', ['pear', '$scope', '$location', function (pear, $scope, $location) {

    pear.onLoad(function(){
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

    $scope.isPromoter = function(project) {
      return pear.users.isCurrent(project.promoter);
    };

    $scope.supporterCount = function(project) {
      // Migrate project.support
      if (project.supporters === undefined) {
        project.supporters = [];

        return 0;
      }

      return project.supporters.length;
    };

    $scope.isSupporter = function(project) {
      // Migrate project.support
      if (project.supporters === undefined) {
        project.supporters = [];

        return false;
      }

      return pear.users.loggedIn() && project.supporters.indexOf(pear.users.current()) > -1;
    };

    $scope.toggleSupport = function(project) {
      // Need a valid login to support
      if (! pear.users.loggedIn()) {
        $location.path('session/new');

        return;
      }

      var index = project.supporters.indexOf(pear.users.current());

      if (index > -1) {
        project.supporters.splice(index, 1);
        } else {
        project.supporters.push(pear.users.current());
      }
    };
  }]);
