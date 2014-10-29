'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:TimelineCtrl
 * @description
 * # TimelineCtrl
 * Controller of the Pear2Pear
 */
angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/timeline', {
        templateUrl: 'views/timeline/show.html',
        controller:'TimelineCtrl'        
      });
  }])

  .controller('TimelineCtrl', ['$scope', function($scope) {
    $scope.timeline = [
      {
        'icon': 'write',
        'heading': 'Buy some drinks',
        'body': 'New task for project Sabado verde'
      }
    ];

    $scope.start = function() {
    };
  }]);
