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
      '$scope', 'SessionSvc', '$location', 'CommunitiesSvc', '$timeout',
      'Loading', '$route', 'NewForm', 'swellRT', '$rootScope', 'Selector',
      'ProjectsSvc', 'User',
      function ($scope, SessionSvc, $location, CommunitiesSvc, $timeout,
                Loading, $route, NewForm, swellRT, $rootScope, Selector,
                ProjectsSvc, User) {

        var editingTitle = false;

        $scope.invite = {
          list : [],
          selected: []
        };

        $scope.userSelectorConfig = Selector.config.users;

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

            Selector.populateUserSelector($scope.invite.list);
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

        $scope.currentNick = function () {
          if (User.loggedIn()) {
            return User.current().nick;
          }
        };

        // FIXME use method from plus controller
        $scope.createProject = function () {
          SessionSvc.loginRequired($scope, function() {
            let params = {};

            params.communityId = $scope.community.id;

            ProjectsSvc.create(params, function(p) {
              $location.path(p.path()).search('form', 'new');
            });
          });
        };
      }],
      templateUrl: 'communities/community.html'
    };
  });
