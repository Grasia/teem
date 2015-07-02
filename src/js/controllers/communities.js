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
      });
  }])
  .controller('CommunitiesCtrl', ['$scope', 'pear', '$location', function ($scope, pear, $location) {

    $scope.newCommunityName = {
      text : ''
    };

    pear.onLoad(function(){
      console.log('onload1');
      $scope.communities = pear.communities.all();
      console.log('onload', $scope.communities);
      $scope.create = function() {
        console.log('create', $scope.newCommunityName);
        pear.communities.create(
          { name: $scope.newCommunityName.text },
          function(community) {
            $scope.showProjects(community.community.id);
            

          });
      };
    });

    $scope.showProjects = function(id) {
      $location.path('/communities/' + encodeURIComponent(id) + '/projects');
    };
  }]);
