'use strict';

var tasks = angular.module('Pear2Pear.tasks', ["ui.select"]);

tasks.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/communities/:community_id/tasks', {
      templateUrl: 'tasks/index.html',
      controller: 'TasksCtrl'
    }).
    when('/tasks/:id', {
      templateUrl: 'tasks/edit.html',
      controller:'EditTaskCtrl'
    });
}]);

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
        id:"2",
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
        }
      ]
    };
  };
  //TODO backend
  $scope.groupUsers =  [
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
    {
      name: "Jorge"
    },
    {
      name: "Laura"
    }
  ];
  $scope.assigSelect = {};
  $scope.assigSelect.assignees = [
    $scope.groupUsers[0],$scope.groupUsers[1],
    $scope.groupUsers[2],$scope.groupUsers[3]
  ];
}]);

editTaskCtrl.config(function(uiSelectConfig) {
  uiSelectConfig.theme = 'select2';
});
