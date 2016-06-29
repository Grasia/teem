'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:CommunitiesCtrl
 * @description
 * # CommunitiesCtrl
 * Controller of the Teem
 */
angular.module('Teem')
  .directive('communities', function() {
    return {
      controller: [
      '$scope', 'SessionSvc', '$location',
      function ($scope, SessionSvc, $location) {
        $scope.newCommunityName = {
          name : ''
        };

        $scope.reset = function() {
          if ($scope.newCommunityName.name === '') {
            $scope.creating = false;
          }
        };

        $scope.showCommunity = function(community) {
          $location.path(community.path());
        };
      }],
      templateUrl: 'communities/communities.html'
    };
  });
