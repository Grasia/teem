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
      id:"reminder1",
      date : new Date()
    },
    
    {
      id:"reminder2",
      date : new Date()//.parse("November 12, 2014 11:15 PM")
    }
  ];
  $scope.reminders[0].date.setFullYear(2014);  
  $scope.reminders[0].date.setMonth(9);
  $scope.reminders[0].date.setDate(8);
  $scope.reminders[0].date.setHours(9);
  $scope.reminders[0].date.setMinutes(30);
  $scope.reminders[0].date.setSeconds(0);
  $scope.reminders[0].date.setMilliseconds(0);
  //this array has the reminders as retrieved from server so when they changes the reminder of the phone can be updated.
  
  var oldReminders = [];
  for (var i = 0; i < $scope.reminders.length; i += 1){
    oldReminders[$scope.reminders[i].id]= new Date($scope.reminders[i].date.getTime());
  }

  //TODO call this function on save form
  $scope.onSave = function(){
    // TODO save other stuff
    
    // saving reminders in phone
    for(var i = 0; i < $scope.reminders.length; i += 1){
      var r = $scope.reminders[i];      
      if (r.date.getTime() !== oldReminders[r.id].getTime()){
        var oldDate = new Date();
        oldDate.setTime(oldReminders[r.id].getTime());
        //FIXME delete event not working
        $scope.deleteReminder(oldDate, $scope.getTask().name);         
        $scope.addReminder(r.date, $scope.getTask().name);
      }
    }
    // TODO save also reminders
  };

  $scope.addReminder = function(date, title){
    var dateWnd = new window.Date();
    dateWnd.setTime(date.getTime());
	var success = function(message) {
	};
	var error = function(message) {
	  alert("Error: " + JSON.stringify(message));
	};
    
	var calOptions = window.plugins.calendar.getCalendarOptions(); // grab the defaults
	calOptions.firstReminderMinutes = 0;
    var comment = "pear2pear reminder";
	window.plugins.calendar.createEventWithOptions(title , "", comment,
                                                   dateWnd, dateWnd, calOptions, success, error);

  };
  
  $scope.deleteReminder = function(date, title){
    var success = function(message) {
    };
	var error = function(message) {
	  alert("Error: " + message);
	};
	var dateWnd = new window.Date();
    dateWnd.setTime(date.getTime());
	window.plugins.calendar.deleteEvent(title, null, null, dateWnd, dateWnd,
				                        success, error);

  };

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
