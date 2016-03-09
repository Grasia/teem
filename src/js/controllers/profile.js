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
      .when('/profile', {
        templateUrl: 'profile/index.html',
        controller: 'ProfileCtrl'
      });
  }])
  .controller('ProfileCtrl', ['$scope', 'SessionSvc', 'Notification', function ($scope, SessionSvc, Notification) {
    SessionSvc.loginRequired($scope, function() {
      $scope.user = SessionSvc.users.current();

      $scope.updateAvatar = function(croppedAvatar) {
        SessionSvc.updateUserProfile({avatarData: croppedAvatar}, function (res) {
          if (res.error) {
            Notification.error(croppedAvatar ? 'profile.avatar.upload.error' : 'profile.avatar.remove.error');
            return;
          }
          Notification.success(croppedAvatar ? 'profile.avatar.upload.success' : 'profile.avatar.remove.success');
        });
      };

    });
  }]);
