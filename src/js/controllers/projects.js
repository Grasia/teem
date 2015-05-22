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

    $scope.projects = pear.projects.all();

    $scope.project = {
        id: '1',
        title: 'Cool project'
      };
    
    $scope.showProjectChat = function (id) {
      $location.path('/projects/' + id + '/chat/');
    };

    $scope.new_ = function () {
      $scope.editing = true;
      //TODO do a proper new project
      $scope.project = {

      };
      $scope.showProject('new');
    };

    $scope.edit = function () {
      $scope.editing = true;
      
    };
    
    $scope.save = function () {
      $scope.editing = false;
      //TODO
    };
    
    $scope.share = function () {
      //TODO
    };
    
  }]);
