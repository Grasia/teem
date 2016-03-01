'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:CommunitiesCtrl
 * @description
 * # CommunitiesCtrl
 * Controller of the Teem
 */
angular.module('Teem')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/communities', {
        templateUrl: 'communities/index.html'
      })
      .when('/communities/new', {
        templateUrl: 'communities/index.html'
      })
      .when('/communities/:id', {
        templateUrl: 'communities/show.html'
      });
  }]);
