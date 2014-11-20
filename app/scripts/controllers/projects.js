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
        templateUrl: 'views/projects/index.html',
        controller: 'ProjectsCtrl'
      })
      .when('/projects/:id/tasks', {
        templateUrl: 'views/projects/show.html',
        controller: 'ProjectsCtrl'
      });
  }])
  .controller('ProjectsCtrl', ['$scope', '$location', function ($scope, $location) {

    $scope.projects = [
      {
        id: '1',
        name : 'Street Art project',
        status: 'Starting'
      },
      {
        id: '2',
        name : 'Feminist film festival',
        status: 'Aproved'
      }
    ];

    $scope.editing = false;

    //TODO get from backend
    $scope.getProject = function () {
      return {
        id: '1',
        name: 'Cool project',
        status: 'Starting',
        description: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec sed odio dui. Cras justo odio, dapibus ac facilisis in.'
      };
    };
    
    $scope.project = {
        id: '1',
        name: 'Cool project',
        status: 'Starting',
        description: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec sed odio dui. Cras justo odio, dapibus ac facilisis in.'
      };
    
    
    //TODO set proper community
    $scope.community = {
      name: 'Really Interesting Community'
    };

    $scope.new_ = function () {
      $scope.editing = true;
      //TODO do a proper new project
      $scope.project = {

      };
    };

    $scope.showProject = function (id) {
      $location.path('/projects/' + id + '/tasks/');
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
