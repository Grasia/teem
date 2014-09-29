'use strict';

var tasks = angular.module('tasks', []); 
tasks.controller('TasksCtrl', ['$scope', function($scope){
  $scope.tasks = 
    [
      {
        name: "Task1", 
        description: "Description1"
      },
      {
        name: "Task2",
        description: "Description2"
      }
    ]
  ;
}]); 
