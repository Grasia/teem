'use strict';

var tasks = angular.module('Pear2Pear.tasks', ['ui.select', 'ui.bootstrap']);

tasks.constant("Modernizr", Modernizr);

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

var editTaskCtrl = tasks.controller('EditTaskCtrl', ['$scope', '$routeParams', 'Modernizr', function($scope, $routeParams, Modernizr) {
  $scope.taskId = $routeParams.id;
  $scope.task = {
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

  $scope.getTask = function(){
    // TODO use backend

    return $scope.task;
  }

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
  // //TODO backend
  $scope.reminders = [
    {
        date : new Date() //.parse("November 1, 2014 10:15 AM")
    },
          
    {date : new Date()//.parse("November 12, 2014 11:15 PM")
    }
  ];
  $scope.getReminders = function(taskId, userId){
    return $scope.reminders;
  };
  $scope.assigSelect = {};
  $scope.assigSelect.assignees = [
    $scope.groupUsers[0],$scope.groupUsers[1],
    $scope.groupUsers[2],$scope.groupUsers[3]
  ];

  $scope.supportsDateInput = Modernizr.inputtypes.date;
  $scope.supportsTimeInput = Modernizr.inputtypes.time;

  $scope.openDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {};

}]);

editTaskCtrl.config(function(uiSelectConfig) {
  uiSelectConfig.theme = 'select2';
});
