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

    // FIXME: model prototype
    $scope.urlId = pear.urlId;

    pear.onLoad(function(){
      $scope.communities = pear.communities.all();
      $scope.create = function() {
        pear.communities.create(
          { name: $scope.newCommunityName.text },
          function(community) {
            $scope.showProjects(community.community.id);
            

          });
      };
    });

    $scope.showProjects = function(id) {
      $location.path('/communities/' + pear.urlId(id) + '/projects');
    };
  }]);
