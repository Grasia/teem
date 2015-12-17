'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:NavbarBottomCtrl
 * @description
 * # NavbarBottom Ctrl
 */

angular.module('Teem')
  .controller('NavbarBottomCtrl', ['url', '$scope', '$route', function(url, $scope, $route){

    $scope.projectsUrl = function(communityId){
      if (communityId) {
        return '#/communities/' + url.urlId(communityId) + '/projects';
      } else {
        return '#/communities';
      }
    };
  }]);
