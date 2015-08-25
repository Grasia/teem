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
      .when('/communities/:comId/projects', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      });
  }])
  .controller('ProjectsCtrl', [
              'pear', '$scope', '$location', '$route',
              function (pear, $scope, $location, $route) {

    $scope.urlId= pear.urlId;

    var comUrlId = $route.current.params.comId;

    pear.onLoad(function(){
      var com = pear.communities.find(comUrlId);
      com.community.then(function(community){
        $scope.community = community;
      });

      if (isSection('mydoing')) {
        pear.projects.myProjects(comUrlId).then(
          function (projects){
            $scope.projects = projects;
          });
      } else {
        com.projects.all().then(
          function (projects){
            $scope.projects = projects;
          });
      }

      $scope.new_ = function () {
        pear.projects.create(function(p) {

          //FIXME model prototype
          $location.path('/communities/' + pear.urlId($scope.community.id) + '/projects/' + pear.urlId(p.id) + '/pad');
        }, $scope.community.id);
      };
      $scope.destroy = function() {
        pear.communities.destroy(pear.urlId($scope.community.id));

        $location.path('/communities');
      };
    });

    //FIXME repeated code in ProjectInfoCtrl
    // Refactorize to service
    function section() {
      if ($route.current.params.section) {
        return $route.current.params.section;
      } else {
        return 'crowddoing';
      }
    }

    function isSection(s) {
      return s === section();
    }

    $scope.nav = function(id) {
      return isSection(id) ? 'selected' : '';
    };

    // TODO: repeated code in NavbarTopCtrl
    $scope.shareIcon = function shareIcon(project) {
      switch (project.shareMode) {
        case 'link':
          return 'fa-link';
        case 'public':
          return 'fa-globe';
        default:
          return '';
      }
    };

    $scope.showProject = function(id) {
      if (section() === 'mydoing') {
        //FIXME model prototype
        $location.path('/communities/' + pear.urlId($scope.community.id) + '/projects/' + pear.urlId(id) + '/pad');
      } else {
        $location.path('/communities/' + pear.urlId($scope.community.id) + '/projects/' + pear.urlId(id));
      }
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

    $scope.supporterCount = function(project) {
      // Migrate project.support
      return project.supporters.length;
    };

    $scope.emptyProjects = function(){
      return $scope.projects && (Object.keys($scope.projects).length === 0);
    };

  }]);
