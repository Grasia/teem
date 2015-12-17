'use strict';

describe('Controller: TasksCtrl', function () {

  // load the controller's module
  beforeEach(module('Teem'));

  var TasksCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TasksCtrl = $controller('TasksCtrl', {
      $scope: scope
    });
  }));

});
