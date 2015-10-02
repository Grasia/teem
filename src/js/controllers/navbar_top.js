'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:NavbarTopCtrl
 * @description
 * # NavbarTop Ctrl
 */

angular.module('Pear2Pear')
  .controller(
    'NavbarTopCtrl', [
      'SwellRTSession', '$scope',
      function(SwellRTSession, $scope){

        var getSharedMode = function(){
          if ($scope.project){
            return $scope.project.shareMode;
          }
          return null;
        };

        $scope.shareIcon = function shareIcon() {
          switch (getSharedMode()) {
            case 'link':
              return 'fa-link';
            case 'public':
              return 'fa-globe';
            default:
              return '';
          }
        };

        $scope.isShared = function(mode) {
          if ($scope.project){
            return getSharedMode() === mode;
          }
          return false;
        };

        $scope.setShared = function setShared(mode){
          $scope.project.setShareMode(mode);
        };

        $scope.timestampProjectAccess = function(){
          $scope.project.timestampProjectAccess();
        };
      }]);
