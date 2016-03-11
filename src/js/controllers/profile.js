'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the Teem
 */

angular.module('Teem')
  .controller('ProfileCtrl', ['$scope', 'SessionSvc', 'Notification', function ($scope, SessionSvc, Notification) {
    SessionSvc.loginRequired($scope, function() {

      $scope.updateAvatar = function(croppedAvatar) {
        SessionSvc.updateUserProfile({avatarData: croppedAvatar}, function (res) {
          if (res.error) {
            Notification.error(croppedAvatar ? 'profile.avatar.upload.error' : 'profile.avatar.remove.error');
            return;
          }
          // TODO: this should update all avatars in a 2-way-data binding way
          document.querySelector('.menu-session-logged-in .avatars img').src = res.data.avatarUrl;
          Notification.success(croppedAvatar ? 'profile.avatar.upload.success' : 'profile.avatar.remove.success');
        });
      };
      $scope.updateAvatar.dataURI = true;

    });
  }]);
