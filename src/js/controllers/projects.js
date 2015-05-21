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
  .controller('ProjectsCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.projects = [
      {
        id: '1',
        title : 'Street Art project'
      },
      {
        id: '2',
        name : 'Feminist film festival'
      }
    ];

    //TODO get from backend
    $scope.getProject = function () {
      return $scope.project;
    };
    
    $scope.project = {
        id: '1',
        title: 'Cool project'
      };
    
    
    $scope.showProject = function (id) {
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
    
    $scope.cancel = function () {
      $scope.project = $scope.getProject();
      $scope.editing = false;
    };
    
    $scope.share = function () {
      //TODO
    };
    
  }]);
