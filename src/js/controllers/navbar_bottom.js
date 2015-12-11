'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:NavbarBottomCtrl
 * @description
 * # NavbarBottom Ctrl
 */

angular.module('Pear2Pear')
  .controller('NavbarBottomCtrl', ['url', '$scope', '$route', function(url, $scope, $route){

    $scope.projectsUrl = function(communityId){
      if (communityId) {
        return '#/communities/' + url.urlId(communityId) + '/projects';
      } else {
        return '#/communities';
      }
    };
  }]);
