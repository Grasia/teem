'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the Pear2Pear
 */
angular.module('Pear2Pear')
  .constant('Modernizr', Modernizr)
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/communities/:community_id/tasks', {
        templateUrl: 'views/tasks/index.html',
        controller: 'TasksCtrl'
      })
      .when('/communities/:community_id/tasks/new', {
        templateUrl: 'views/tasks/new.html',
        controller: 'TasksCtrl'
      })
      .when('/tasks/:id', {
        templateUrl: 'views/tasks/edit.html',
        controller: 'TasksCtrl'
      });
  }])
  .controller('TasksCtrl', ['$scope', '$location', '$routeParams', 'Modernizr', function ($scope, $location, $routeParams, Modernizr) {

    $scope.tasks =
      [
        {
          id: '1',
          name: 'Task1',
          description: 'Description1',
          completed: true,
          creationDate: new Date(2),
          completionDate: new Date(1000),
          assignees: [
            {
              name: 'Antonio'
            },
            {
              name: 'Pablo'
            },
            {
              name: 'Samer'
            },
            {
              name: 'Juan'
            }
          ]
        },
        {
          id: '2',
          name: 'Task2',
          completed: false,
          description: 'Description2',
          creationDate: new Date(1),
          completionDate: null,
          assignees: [
          ]
        }
      ];

    $scope.toggleCompleted = function (task) {
      task.completed = !task.completed;
      if (task.completed) {
        task.completionDate = new Date();
      } else {
        task.completionDate = null;
      }
    };

   //TODO backend

    $scope.task =  {
      id: '1',
      name: 'Task1',
      description: 'Description1',
      completed: true,
      assignees: [
        {
          name: 'Antonio'
        },
        {
          name: 'Pablo'
        },
        {
          name: 'Samer'
        },
        {
          name: 'Juan'
        }
      ],
      deadlineDate : new Date(),
      reminders: [
        {
          id: 'reminder1',
          date : new Date() //.parse('November 1, 2014 10:15 AM')
        },
        {
          id: 'reminder2',
          date : new Date()//.parse('November 12, 2014 11:15 PM')
        }
      ]
    };

    var communityId = function () {
      return $routeParams.community_id || $scope.task && $scope.task.id;
    };

    var getCommunity = function () {
      //TODO backend
      if (communityId()) {
        return {
          id: $routeParams.community_id,
          name: 'UCM P2Pvalue',
          users: [
            {
              name: 'Antonio'
            },
            {
              name: 'Pablo'
            },
            {
              name: 'Samer'
            },
            {
              name: 'Juan'
            },
            {
              name: 'Jorge'
            },
            {
              name: 'Laura'
            }
          ]
        };
      }
    };

    $scope.reminders = $scope.task.reminders;
    $scope.$watch('reminders', function () {
      var i = $scope.reminders.length - 1;
      if ($scope.reminders[i].date) {
        $scope.reminders.push({id: 'newId' + i, date : null});
      }
    }, true);

    //TODO erase empty
    if ($scope.reminders[0]) {
      $scope.reminders[0].date.setFullYear(2014);
      $scope.reminders[0].date.setMonth(9);
      $scope.reminders[0].date.setDate(8);
      $scope.reminders[0].date.setHours(9);
      $scope.reminders[0].date.setMinutes(30);
      $scope.reminders[0].date.setSeconds(0);
      $scope.reminders[0].date.setMilliseconds(0);
      //this array has the reminders as retrieved from server so when they changes the reminder of the phone can be updated.

      var oldReminders = {};
      for (var i = 0; i < $scope.reminders.length; i += 1) {
        if ($scope.reminders[i].date) {
          oldReminders[$scope.reminders[i].id] = new Date();
          oldReminders[$scope.reminders[i].id].setTime($scope.reminders[i].date.getTime());
        }
      }
    }

    $scope.isApp = function () {
      return window.location.search.search('cordova') > 0;
    };

    //TODO call this function on save form
    $scope.save = function () {
      // TODO save other stuff
      // saving reminders in phone
      for (var i = 0; i < $scope.reminders.length; i += 1) {
        var r = $scope.reminders[i];
        if (r.date && r.date.getTime() !== oldReminders[r.id].getTime()) {
          var oldDate = new Date();
          oldDate.setTime(oldReminders[r.id].getTime());
          //FIXME delete event not working
          $scope.deleteReminder(oldDate, $scope.getTask().name);
          $scope.addReminder(r.date, $scope.getTask().name);
        }
      }
      // TODO save also reminders
      $scope.index();
    };

    $scope.addReminder = function (date, title) {
      var dateWnd = new window.Date();
      dateWnd.setTime(date.getTime());
      var success = function () {
      };
      var error = function (message) {
        window.alert('Error: ' + JSON.stringify(message));
      };
      
      var calOptions = window.plugins.calendar.getCalendarOptions(); // grab the defaults
      calOptions.firstReminderMinutes = 0;
      var comment = 'pear2pear reminder';
      window.plugins.calendar.createEventWithOptions(title, '', comment, dateWnd, dateWnd, calOptions, success, error);

    };

    $scope.deleteReminder = function (date, title) {
      var success = function () {
      };
      var error = function (message) {
        window.alert('Error: ' + message);
      };
      var dateWnd = new window.Date();
      dateWnd.setTime(date.getTime());
      window.plugins.calendar.deleteEvent(title, null, null, dateWnd, dateWnd,
                                          success, error);
      
    };

    $scope.getReminders = function (taskId, userId) {
      return $scope.reminders;
    };

    $scope.community = getCommunity();

    $scope.index = function () {
      $location.path('communities/' + communityId()  + '/tasks');
    };

    $scope.new = function () {
      $location.path('communities/' + communityId() + '/tasks/new');
    };

    $scope.edit = function (task) {
      $location.path('tasks/' + task.id);
    };

    $scope.community_index = function () {
      $location.path('communities');
    };

    $scope.assigSelect = {
      assignees: $scope.community.users
    };

    $scope.supportsDateInput = Modernizr.inputtypes.date;
    $scope.supportsTimeInput = Modernizr.inputtypes.time;

    $scope.dateOptions = {};

  }])

  .directive(
    'dateInput',
    function (dateFilter) {
      return {
        require: '^ngModel',
        template: '<input type="date"></input>',
        replace: true,
        link: function (scope, elm, attrs, ngModelCtrl) {
          ngModelCtrl.$formatters.unshift(function (modelValue) {
            return dateFilter(modelValue, 'yyyy-MM-dd');
          });

          ngModelCtrl.$parsers.unshift(function (viewValue) {
            return new Date(viewValue);
          });
        }
      };
    })
  .directive(
    'timeInput',
    function (dateFilter) {
      return {
        require: '^ngModel',
        template: '<input type="time"></input>',
        replace: true,
        link: function (scope, elm, attrs, ngModelCtrl) {
          ngModelCtrl.$formatters.unshift(function (modelValue) {
            return dateFilter(modelValue, 'HH:mm');
          });

          ngModelCtrl.$parsers.unshift(function (viewValue) {
            var newDate = new Date();
            if (ngModelCtrl.$modelValue) {
              newDate.setTime(ngModelCtrl.$modelValue.getTime());
            }
            newDate.setHours(viewValue.split(':')[0]);
            newDate.setMinutes(viewValue.split(':')[1]);
            newDate.setSeconds(0);
            return newDate;
          });
        }
      };
    })

  .directive(
    'datetimeInput',
    function () {
      return {
        restrinct: 'AE',
        scope: {
          dateModel : '='
        },
        templateUrl: 'views/datetimeinput.html',
        replace : true
      };
    }
  )

  .config(function (uiSelectConfig) {
    uiSelectConfig.theme = 'select2';
  });


