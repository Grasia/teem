'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the Teem
 */

angular.module('Teem')
  .config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/users/:id', {
      templateUrl: 'users/user.html',
      controller: 'ProfileCtrl'
    });
  }])
  .controller('ProfileCtrl', ['$scope', '$route', 'SessionSvc', 'Notification', 'User', 'ProjectsSvc', 'CommunitiesSvc',
  function ($scope, $route, SessionSvc, Notification, User, ProjectsSvc, CommunitiesSvc) {

    SessionSvc.onLoad(function() {
      $scope.user = new User($route.current.params.id);
      $scope.canEdit =  function() {
        return User.isCurrent($scope.user.id);
      };

      CommunitiesSvc.all({ participant: $scope.user.id }).
      then(function(communities) {
        $scope.communities = communities;
      });

      ProjectsSvc.all({ contributor: $scope.user.id }).
      then(function(projects) {
        $scope.projects = projects;
      });

      $scope.updateAvatar = function(croppedAvatar) {
        SessionSvc.updateUserProfile({avatarData: croppedAvatar}, function (res) {
          if (res.error) {
            Notification.error(croppedAvatar ? 'profile.avatar.upload.error' : 'profile.avatar.remove.error');
            return;
          }
          // TODO: this should update all avatars in a 2-way-data binding way
          document.querySelector('.menu-session-logged-in .avatars img').src = res.data.avatarUrl;
          document.querySelector('.profile .avatar-responsive img').src = res.data.avatarUrl;
          Notification.success(croppedAvatar ? 'profile.avatar.upload.success' : 'profile.avatar.remove.success');
        });
      };
      $scope.updateAvatar.dataURI = true;
    });
  }]);
