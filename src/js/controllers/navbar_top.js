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

        $scope.$on('$locationChangeStart', function(event) {
          pear.onLoad(function(){
            if ($route.current.params.id){
              $scope.project = pear.projects.find($route.current.params.id)
                .then(function(proxy) {
                  console.log(proxy);
                  $scope.project = proxy;
                });
            }
          });
        });


        $scope.isPublicShared = function() {
          if ($scope.project){
            return getSharedMode() === 'public';
          }
          return false;
        };

        $scope.isLinkShared = function() {
          if ($scope.project){
            return getSharedMode() === 'link';
          }
          return false;
        };

        $scope.isInviteShared = function() {
          if ($scope.project){
            return getSharedMode() === 'invite';
          }
          return false;
        };

        var setShareMode = function(mode){
          pear.projects.setShareMode($route.current.params.id, mode);
        };

        $scope.setPublicShared = function(){
          setShareMode('public');
        };

        $scope.setLinkShared = function(){
          setShareMode('link');
        };

        $scope.setInviteShared = function(){
          setShareMode('invite');
        };
  }]);
