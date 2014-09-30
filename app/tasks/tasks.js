'use strict';

var tasks = angular.module('tasks', []); 
tasks.controller('TasksCtrl', ['$scope', function($scope){
  $scope.tasks = 
    [
      {
        name: "Task1", 
        description: "Description1",
        completed: true,
        assignees: [
          {name: "Antonio"
          },
          {name: "Pablo"
          },
          {name: "Samer"
          },
          {name: "Juan"
          },          
        ]
      },
      {
        name: "Task2",
        completed: false,
        description: "Description2",
assignees: [         
        ]
      }
    ]
  ;
}]); 
