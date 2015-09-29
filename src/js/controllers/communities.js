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
  .controller('CommunitiesCtrl', ['$scope', 'SwellRTSession', 'pear', '$location', function ($scope, SwellRTSession, pear, $location) {

    $scope.newCommunityName = {
      name : ''
    };

    // FIXME: model prototype
    $scope.urlId = pear.urlId;

    SwellRTSession.onLoad(function(){
      pear.communities.all().then(function(communities){
        $scope.communities = communities;
      });
      $scope.create = function(name) {
        pear.communities.create(
          { name: name || $scope.newCommunityName.name },
          function(community) {

            $scope.showProjects(community.id);

          });
      };
    });

    $scope.showProjects = function(id) {
      pear.communities.setCurrent(pear.urlId(id));
      $location.path('/communities/' + pear.urlId(id) + '/projects');
    };
  }]);
