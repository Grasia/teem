'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:CommunitiesCtrl
 * @description
 * # CommunitiesCtrl
 * Controller of the Teem
 */
angular.module('Teem')
  .directive('community', function() {
    return {
      controller: [
      '$scope', 'SessionSvc', 'url', '$location', 'CommunitiesSvc', '$timeout',
      'Loading', '$route', 'NewForm', 'swellRT',
      function ($scope, SessionSvc, url, $location, CommunitiesSvc, $timeout,
                Loading, $route, NewForm, swellRT) {

        var edittingTitle = false;

        SessionSvc.onLoad(function(){
          Loading.show(CommunitiesSvc.findByUrlId($route.current.params.id)).
            then(function(community){
              $scope.community = community;

              Loading.show(community.myAndPublicProjects()).
              then(function (projects){

                $scope.projects = projects;
              });
            });
        });

        NewForm.initialize($scope, 'community');

        $scope.uploadCommunityPhoto = function(file) {
          $scope.community.image = new swellRT.FileObject(file);
        };
        $scope.uploadCommunityPhoto.areaType = 'rectangle';

        $scope.edittingTitle = function() {
          return edittingTitle || $scope.isNew();
        };

        $scope.showEditTitle = function() {
          edittingTitle = true;
        };

        $scope.hideEditTitle = function() {
          edittingTitle = false;
        };
      }],
      templateUrl: 'communities/community.html'
    };
  });
