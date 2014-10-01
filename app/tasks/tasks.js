'use strict';

var tasks = angular.module('tasks', []);
var tasksCtrl = tasks.controller('TasksCtrl', ['$scope', '$location', function($scope, $location){

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
      $location.path('tasks/' + task.id);
  };
 
  $scope.alert = function(message){
    alert(message);
  };
    
    
}]);

var editTaskCtrl = tasks.controller('EditTaskCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {  
    $scope.taskId = $routeParams.id;
  
    $scope.getTask = function(){
        // TODO use backend
        
        return {
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
        };
    };
}]);
