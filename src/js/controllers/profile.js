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
  .controller('ProfileCtrl', ['$scope', 'SessionSvc', function ($scope, SessionSvc) {
    $scope.user = SessionSvc.users.current();
    $scope.rawAvatar = '';
    $scope.croppedAvatar = '';
    $scope.cropping = false;

    function handleFileSelect(evt) {
      $scope.cropping = true;
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope) {
          $scope.rawAvatar = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    }
    angular.element(document.querySelector('#avatar')).on('change', handleFileSelect);

    $scope.saveAvatar = function() {
      $scope.cropping = false;
    };

    $scope.deleteAvatar = function() {
      $scope.rawAvatar = '';
      $scope.croppedAvatar = '';
    };
  }]);
