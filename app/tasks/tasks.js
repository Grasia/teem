'use strict';

var tasks = angular.module('Pear2Pear.tasks', ['ui.select', 'ui.bootstrap']);

tasks.constant("Modernizr", Modernizr);

tasks.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/communities/:community_id/tasks', {
      templateUrl: 'tasks/index.html',
      controller: 'TasksCtrl'
    }).
    when('/communities/:community_id/tasks/new', {
      templateUrl: 'tasks/new.html',
      controller: 'TasksCtrl'
    }).

    when('/tasks/:id', {
      templateUrl: 'tasks/edit.html',
      controller:'TasksCtrl'
    });
}]);

var tasksCtrl = tasks.controller('TasksCtrl', ['$scope', '$location', '$routeParams', 'Modernizr', function($scope, $location, $routeParams, Modernizr){

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

  $scope.edit = function(task){
    $location.path('tasks/' + task.id);
  };

  $scope.community_show = function() {
    $location.path('communities/' + $routeParams.community_id);
  };

  var getTask = function(){
    // TODO use backend
    if ($routeParams) {
      return {
        id: "1",
        name: "Task1",
        description: "Description1",
        community_id: 1,
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
        ],
        reminders: [
          {
            date : new Date() //.parse("November 1, 2014 10:15 AM")
          },
          {
            date : new Date()//.parse("November 12, 2014 11:15 PM")
          }
        ]
      };
    } else {
      return {
        reminders: []
      };
    }
  };

  $scope.task = getTask();

  var getCommunity = function() {
    //TODO backend
    if ($routeParams.community_id || $scope.task && $scope.task.community_id) {
      return {
        id: $routeParams.community_id,
        name: "UCM P2Pvalue",
        users: [
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
        ]
      };
    }
  };

  $scope.community = getCommunity();

  $scope.assigSelect = {
    assignees: $scope.community.users
  };

  $scope.supportsDateInput = Modernizr.inputtypes.date;
  $scope.supportsTimeInput = Modernizr.inputtypes.time;

  $scope.openDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {};

}]);

tasksCtrl.config(function(uiSelectConfig) {
  uiSelectConfig.theme = 'select2';
});
