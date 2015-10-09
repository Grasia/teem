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
        templateUrl: 'communities/community-none.html',
        controller: 'CommunitiesCtrl'
      });
  }])
  .controller('CommunitiesCtrl', ['$scope', 'SwellRTSession', 'url', '$location', 'CommunitiesSvc', function ($scope, SwellRTSession, url, $location, CommunitiesSvc) {

    $scope.newCommunityName = {
      name : ''
    };

    // FIXME: model prototype
    $scope.urlId = url.urlId;

    SwellRTSession.onLoad(function(){
      CommunitiesSvc.all().then(function(communities){
        $scope.communities = communities;
      });
      $scope.create = function(name) {
        CommunitiesSvc.create(
          { name: name || $scope.newCommunityName.name },
          function(community) {
            // TODO: bring following call to controller code
            $scope.showProjects(community.id);
          });
      };
    });

    $scope.showProjects = function(id) {
      CommunitiesSvc.setCurrent(url.urlId(id));
      $location.path('/communities/' + url.urlId(id) + '/projects');
    };
  }]);
