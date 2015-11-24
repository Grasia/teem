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
      'SessionSvc', '$scope', '$route', 'ProjectsSvc',
      function(SessionSvc, $scope, $route, ProjectsSvc){

        var getSharedMode = function(){
          if ($scope.project){
            return $scope.project.shareMode;
          }
          return null;
        };

        $scope.$on('$routeChangeSuccess', function() {
          if ($route.current && $route.current.params.id){
            SessionSvc.onLoad(function(){
              ProjectsSvc.find($route.current.params.id)
                .then(function(proxy) {
                  $scope.project = proxy;
                });
            });
          }
        });

        $scope.shareIcon = function shareIcon() {
          switch (getSharedMode()) {
            case 'link':
              return 'fa-share-alt';
            case 'public':
              return 'fa-share-alt';
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
      }]);
