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

    $scope.comId = decodeURIComponent($route.current.params.id);
    pear.onLoad(function(){
      console.log('param: ', $scope.comId);
      var com = pear.communities.find($scope.comId);
      $scope.community = com.community;
      com.projects.all().then(
        function (projects){
          $scope.projects = projects;
        });

      $scope.new_ = function () {
        pear.projects.create(function(p) {
          var pId = encodeURIComponent(p.id);
          $scope.community.projects.push(p.id);
          $location.path('/projects/' + pId + '/pad/');
        });
      };
    });

    $scope.showProjectChat = function (id) {
      var pId = encodeURIComponent(id);
      $location.path('/projects/' + pId + '/chat/');
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
