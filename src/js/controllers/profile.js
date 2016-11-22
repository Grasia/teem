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

      ProjectsSvc.all({ contributor: $scope.user.id, projection: ProjectsSvc.projectListProjection }).
      then(function(projects) {
        $scope.projects = projects;
      });

      $scope.leave = function(model) {
        if (model.type !== 'project' && model.type !== 'community') {
          return;
        }
        let modelSvc = model.type === 'project' ? ProjectsSvc : CommunitiesSvc;
        let collection = model.type === 'project' ? 'projects' : 'communities';
        modelSvc.findByUrlId(model._urlId).then(function(writable) {
          writable.removeParticipant();
          $scope[collection] = $scope[collection].filter(item => item._urlId !== model._urlId);
        });
      };

      $scope.updateAvatar = function(croppedAvatar) {
        SessionSvc.updateUserProfile({avatarData: croppedAvatar}, function (res) {
          if (res.error) {
            Notification.error(croppedAvatar ? 'profile.avatar.upload.error' : 'profile.avatar.remove.error');
            return;
          }
          let img = document.querySelector('.profile .avatar-responsive img');
          // TODO: this should update all avatars in a 2-way-data binding way
          img.src = res.data.avatarUrl;
          img.addEventListener('load', () => {
            Notification.success(croppedAvatar ? 'profile.avatar.upload.success' : 'profile.avatar.remove.success');
            $scope.updateAvatar.loading = false;
          });
        });
      };
      $scope.updateAvatar.dataURI = true;
    });
  }]);
