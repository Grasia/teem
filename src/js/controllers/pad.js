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
      .when('/communities/:comId/projects/:id/pad', {
        templateUrl: 'pad/show.html',
        controller: 'PadCtrl'
      });
  }])
  .controller('PadCtrl', ['pear', '$scope', '$route', '$location', '$filter', function(pear, $scope, $route, $location, $filter){

    $scope.escapedComId = window.encodeURIComponent($route.current.params.comId);

    pear.onLoad(function(){
      pear.projects.find($filter('unescapeBase64')($route.current.params.id))
        .then(function(proxy) {
          $scope.project = proxy;
        });
    });

    $scope.showChat = function() {
      $location.path('/communities/' + $route.current.params.comId + '/projects/' + $route.current.params.id + '/chat');
    };

    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262
    $scope.nav = function(id) {
      return id === 'pad' ? 'active' : '';
    };

  }]);
