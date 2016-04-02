'use strict';

angular.module('Teem')
  .directive('plus', function() {
    return {
      scope: {
        community: '=plusCommunity',
        type: '@plusType'
      },
      controller: [
      '$scope', 'SessionSvc', 'CommunitiesSvc', 'ProjectsSvc', '$location',
      function($scope, SessionSvc, CommunitiesSvc, ProjectsSvc, $location) {

        SessionSvc.onLoad(function(){
          $scope.create = function () {
            SessionSvc.loginRequired($scope, function() {
              let params = {};

              if ($scope.type === 'community') {

                CommunitiesSvc.create({}, function(c) {
                  $location.path('/communities/' + c.urlId).search('form', 'new');
                });

              } else if ($scope.type === 'project') {

                if ($scope.community) {
                  params.communityId = $scope.community.id;
                }

                ProjectsSvc.create(params, function(p) {
                  $location.path('/teems/' + p.urlId).search('form', 'new');
                });
              }
            });
          };
        });

      }],
      templateUrl: 'plus.html'
    };
  });
