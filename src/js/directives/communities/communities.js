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
      '$scope', 'SessionSvc', '$location', 'CommunitiesSvc', '$timeout', 'Loading',
      function ($scope, SessionSvc, $location, CommunitiesSvc, $timeout, Loading) {
        $scope.newCommunityName = {
          name : ''
        };

        SessionSvc.onLoad(function(){
          Loading.show(CommunitiesSvc.all({ projectCount: true })).
            then(function(communities){
              $scope.communities = communities;
            });

          $scope.create = function(name) {
            SessionSvc.loginRequired($scope, function() {
              $scope.created = true;

              CommunitiesSvc.create(
                { name: name || $scope.newCommunityName.name },
                function(community) {
                  // TODO: bring following call to controller code
                  $scope.showCommunity(community.id);
                });
            });
          };
        });

        $scope.new_ = function() {
          SessionSvc.loginRequired($scope, function() {
            $scope.creating = true;
            // Need the timeout for the focus to work
            $timeout(function() {
              document.querySelector('.community-search input').focus();
            });
          });
        };

        if ($location.path() === '/communities/new') {
          $scope.new_();
        }

        $scope.reset = function() {
          if ($scope.newCommunityName.name === '') {
            $scope.creating = false;
          }
        };

        $scope.showCommunity = function(community) {
          $location.path('/communities/' + community.urlId);
        };
      }],
      templateUrl: 'communities/communities.html'
    };
  });
