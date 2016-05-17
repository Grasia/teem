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
      'Loading', '$route', 'NewForm', 'swellRT', '$rootScope',
      function ($scope, SessionSvc, url, $location, CommunitiesSvc, $timeout,
                Loading, $route, NewForm, swellRT, $rootScope) {

        var editingTitle = false;

        SessionSvc.onLoad(function(){
          Loading.show(CommunitiesSvc.findByUrlId($route.current.params.id)).
            then(function(community){
              $scope.community = community;

              $rootScope.og = {
                title: community.name,
                description: community.description,
                url: community.url(),
                image: community.logoUrl()
              };

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

        $scope.editingTitle = function() {
          return editingTitle || $scope.isNew();
        };

        $scope.showEditTitle = function() {
          editingTitle = true;
        };

        $scope.hideEditTitle = function() {
          editingTitle = false;
        };
      }],
      templateUrl: 'communities/community.html'
    };
  });
