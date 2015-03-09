'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ThanksappCtrl
 * @description
 * # Thanksapp Ctrl
 * Controller of the Pear2Pear
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/collab/work/:id', {
        templateUrl: 'views/help/show-collab.html',
        controller: 'HelpCtrl'
      });
  }])
  .controller('ThanksappCtrl', ['$scope', '$location', '$route', function($scope, $location, $route){

}]);
