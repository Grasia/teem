'use strict';

angular.module('Teem')
  .directive('projectPlus', function() {
    return {
      scope: {
        community: '=projectPlusCommunity'
      },
      controller: [
      '$scope', 'SessionSvc', 'ProjectsSvc', '$location',
      function($scope, SessionSvc, ProjectsSvc, $location) {

        SessionSvc.onLoad(function(){
          $scope.create = function () {
            SessionSvc.loginRequired(function() {
              let params = {};

              if ($scope.community) {
                params.communityId = $scope.community.id;
              }

              ProjectsSvc.create(params, function(p) {
                $location.path('/projects/' + p.urlId + '/new');
              });
            });
          };
        });

      }],
      templateUrl: 'projects/plus.html'
    };
  });
