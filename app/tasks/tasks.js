'use strict';

var tasks = angular.module('tasks', []);
tasks.controller('TasksCtrl', ['$scope', function($scope){

  $scope.tasks =
    [
      {
        id: "1",
        name: "Task1",
        description: "Description1",
        completed: true,
        assignees: [
          {
            name: "Antonio"
          },
          {
            name: "Pablo"
          },
          {
            name: "Samer"
          },
          {
            name: "Juan"
          },
        ]
      },
      {
        id:2,
        name: "Task2",
        completed: false,
        description: "Description2",
        assignees: [
        ]
      }
    ];

  $scope.toggleCompleted = function(task){
    task.completed = !task.completed;
  };

  $scope.editTask = function(task){
    $location.path("task:"+task.id);
  };
  $scope.alert = function(message){
    alert(message);
  };
}]);
