'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:CommunitiesCtrl
 * @description
 * # CommunitiesCtrl
 * Controller of the Pear2Pear
 */
angular.module('Pear2Pear')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/communities', {
        templateUrl: 'communities/index.html',
        controller: 'CommunitiesCtrl'
      })
  }])
  .controller('CommunitiesCtrl', ['$scope', 'pear', function ($scope, pear) {
    pear.onLoad(function(){
      $scope.communities = pear.communities.all();

      $scope.new_ = function () {
        pear.communties.create(function() {
          return;
        });
      };
    });
  }]);
