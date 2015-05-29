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
    });

    $scope.showProjectChat = function (id) {
      $location.path('/projects/' + id + '/chat/');
    };

    
  }]);
