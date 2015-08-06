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
      'pear', '$scope', '$route',
      function(pear, $scope, $route){

        var getSharedMode = function(){
          if ($scope.project){
            return $scope.project.shareMode;
          }
          return null; 
        };

        pear.onLoad(function(){
          if ($route.current.params.id){
            $scope.project = pear.projects.find($route.current.params.id)
              .then(function(proxy) {
                console.log(proxy);
                $scope.project = proxy;
              });
          }
        });

        $scope.isPublicShared = function() {
          if ($scope.project){
            return getSharedMode() === pear.projects.shareMode.PUBLIC;
          }
          return false;
        };

        $scope.isLinkShared = function() {
          if ($scope.project){
            return getSharedMode() === pear.projects.shareMode.LINK;
          }
          return false;
        };

        $scope.isInviteShared = function() {
          if ($scope.project){
            return getSharedMode() === pear.projects.shareMode.INVITE;
          }
          return false;
        };

        var setShareMode = function(mode){
          console.log($route.current.params.id, mode);
          pear.projects.setShareMode($route.current.params.id, mode);
        };

        $scope.setPublicShared = function(){
          console.log('pub');
          setShareMode(pear.projects.shareMode.PUBLIC);
        };

        $scope.setLinkShared = function(){
          console.log('link');
          setShareMode(pear.projects.shareMode.LINK);
        };

        $scope.setInviteShared = function(){
          setShareMode(pear.projects.shareMode.INVITE);
        };
  }]);
