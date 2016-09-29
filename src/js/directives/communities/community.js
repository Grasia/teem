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
      'ProjectsSvc', 'User', 'SharedState',
      function ($scope, SessionSvc, $location, CommunitiesSvc, $timeout,
                Loading, $route, NewForm, swellRT, $rootScope, Selector,
                ProjectsSvc, User, SharedState) {

        var editingTitle = false;

        $scope.bussyPagination = true;

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

              var projsPromise = community.myAndPublicProjects();

              Loading.show(projsPromise).
              then(function (projects){

                if (projects.length > 0){

                  $scope.projects = projects;

                  $scope.projsNextPage = projsPromise.next;
                  $scope.bussyPagination = false;
                }

              });
            });

            Selector.populateUserSelector($scope.invite.list);
        });

        $scope.getProjectsPage = function() {
          if ($scope.bussyPagination){
            return;
          }
          if ($scope.projects && typeof $scope.projsNextPage === 'function'){
            $scope.bussyPagination = true;
            var projsPromise = $scope.projsNextPage();
            projsPromise.then((projects)=>{

              if (projects.length > 0) {
                Array.prototype.push.apply(
                  $scope.projects,
                  projects);

                  $scope.projsNextPage = projsPromise.next;
                  $scope.bussyPagination = false;
              }

            });
          }
        };

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
              $location.path(p.path()).search('form', 'image');
            });
          });
        };

        $scope.inviteUsers = function(){
          Selector.invite($scope.invite.selected, $scope.community);
          $scope.invite.selected = [];
          SharedState.turnOff('modal.invite');
        };

        $scope.cancelInvite = function(){
          $scope.invite.selected = [];
          SharedState.turnOff('modal.invite');
        };
      }],
      templateUrl: 'communities/community.html'
    };
  });
