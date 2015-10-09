'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:NavbarBottomCtrl
 * @description
 * # NavbarBottom Ctrl
 */

angular.module('Pear2Pear')
  .controller('NavbarBottomCtrl', ['url', '$scope', '$route', function(url, $scope, $route){
    
    //FIXME repeated code in ProjectInfoCtrl
    // Refactorize to service
    function section() {
      if ($route.current.params.section) {
        return $route.current.params.section;
      } else {
        return 'crowddoing';
      }
    };

    function isSection(s) {
      return s === section();
    };

    $scope.nav = function(id) {
      return isSection(id) ? 'selected' : '';
    };

    $scope.projectsUrl = function(communityId){
      if (communityId) {
        return '#/communities/' + url.urlId(communityId) + '/projects';
      } else {
        return '#/communities';
      }
    };
  }]);
