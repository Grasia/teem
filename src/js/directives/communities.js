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
      '$scope', 'SessionSvc', 'url', '$location', 'CommunitiesSvc', '$timeout', 'Loading',
      function ($scope, SessionSvc, url, $location, CommunitiesSvc, $timeout, Loading) {
        $scope.newCommunityName = {
          name : ''
        };

        // FIXME: model prototype
        $scope.urlId = url.urlId;

        SessionSvc.onLoad(function(){
          Loading.create(CommunitiesSvc.all()).
            then(function(communities){
              $scope.communities = communities;
            });

          $scope.create = function(name) {
            SessionSvc.loginRequired(function() {
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
          SessionSvc.loginRequired(function() {
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

        $scope.showCommunity = function(id) {
          $location.path('/communities/' + url.urlId(id));
        };
      }],
      templateUrl: 'communities/communities.html'
    };
  });
