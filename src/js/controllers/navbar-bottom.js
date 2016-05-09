'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:NavbarBottomCtrl
 * @description
 * # NavbarBottom Ctrl
 */

angular.module('Teem')
  .controller('NavbarBottomCtrl', ['url', '$scope', function(url, $scope){

    $scope.projectsUrl = function(communityId){
      if (communityId) {
        return '/communities/' + url.urlId(communityId) + '/teems';
      } else {
        return '/communities';
      }
    };
  }]);
