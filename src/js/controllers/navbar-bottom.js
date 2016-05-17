'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:NavbarBottomCtrl
 * @description
 * # NavbarBottom Ctrl
 */

angular.module('Teem')
  .controller('NavbarBottomCtrl', ['Url', '$scope', function(Url, $scope){

    $scope.projectsUrl = function(communityId){
      if (communityId) {
        return '/communities/' + Url.encode(communityId) + '/teems';
      } else {
        return '/communities';
      }
    };
  }]);
