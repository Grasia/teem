'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ChatCtrl
 * @description
 * # Chat Ctrl
 * Show Pad for a given project
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/communities/:communityId/projects/:id/pad', {
        templateUrl: 'pad/show.html',
        controller: 'PadCtrl'
      });
  }])
  .controller('PadCtrl', [
              'pear', '$scope', '$route', '$location',
              function(pear, $scope, $route, $location){

    $scope.urlId = pear.urlId;
    $scope.communityId = $route.current.params.communityId;

    pear.onLoad(function(){
      pear.projects.find($route.current.params.id)
        .then(function(proxy) {
          $scope.project = proxy;
        });
    });

    $scope.showChat = function() {
      //FIXME model prototype
      $location.path('/projects/' + pear.urlId($scope.project.id) + '/chat');
    };

    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262
    $scope.nav = function(id) {
      return id === 'pad' ? 'active' : '';
    };

  }]);
