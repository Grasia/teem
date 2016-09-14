'use strict';

angular.module('Teem')
  .directive('plus', function() {
    return {
      scope: {
        community: '=plusCommunity',
        type: '@plusType',
        text: '@text'
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
                  $location.path(c.path()).search('form', 'new');
                });

              } else if ($scope.type === 'project') {

                if ($scope.community) {
                  params.communityId = $scope.community.id;
                }

                ProjectsSvc.create(params, function(p) {
                  $location.path(p.path()).search('form', 'image');
                });
              }
            },
            {
              form: 'register',
              message: 'new_' + $scope.type
            });
          };
        });

      }],
      templateUrl: 'plus.html'
    };
  });
