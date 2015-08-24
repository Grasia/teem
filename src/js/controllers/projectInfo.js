'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ProjectInfoCtrl
 * @description
 * # ProjectInfoCtrl
 * Controller of the Pear2Pear
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/communities/:communityId/projects/:id', {
        templateUrl: 'projects/info.html',
        controller: 'ProjectInfoCtrl'
      });
  }])
  .controller('ProjectInfoCtrl', [
              'pear', '$scope', '$location', '$route', '$timeout',
              function (pear, $scope, $location, $route, $timeout) {

    $scope.urlId= pear.urlId;

    $scope.communityId = $route.current.params.communityId;

    pear.onLoad(function(){
      pear.communities.find($route.current.params.communityId)
        .community.then(function(community){
        $scope.community = community;
      });

      pear.projects.find($route.current.params.id)
        .then(function(proxy) {
          $scope.project = proxy;
        });
    });

    $scope.isSupporter = function(project) {
      if (!project) {
        return false;
      }

      if (!project.supporters) {
        return false;
      }
      // Migrate project.support
      return pear.users.loggedIn() && project.supporters.indexOf(pear.users.current()) > -1;
    };

    $scope.toggleSupport = function(project) {
      // Need a valid login to support
      if (! pear.users.loggedIn()) {
        $location.path('session/new');

        return;
      }

      pear.toggleSupport(project.id);
      var index = project.supporters.indexOf(pear.users.current());
      $timeout(function(){
        if (index > -1) {
          project.supporters.splice(index, 1);
        } else {
          project.supporters.push(pear.users.current());
        }
      });
    };

    function section() {
      if ($route.current.params.section) {
        return $route.current.params.section;
      } else {
        return 'information';
      }
    }

    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262
    $scope.nav = function(id) {
      return id === section() ? 'active' : '';
    };

    //TODO backend
    $scope.needs = [
      {
        text: 'One completed need',
        completed: 'true',
        comments: []
      },
      { text: 'One non completed need',
        completed: 'false',
        comments: []
      },
      {
        text: 'One completed need, in the second place',
        completed: 'true',
        comments: []
      },
      { text: 'One non completed need, in the second place',
        completed: 'false',
        comments: []
      },
      {
        text: 'One need with comments',
        completed: 'false',
        comments: [
          {
            text: 'One comment',
            time: '2015-08-24T13:16:53.259Z',
            author: 'pepe@local.net'
          },
          {
            text: 'Other comment',
            time: '2015-08-24T13:16:55.259Z',
            author: 'pepe2@local.net'
          }
        ]
      }
    ];
  }]);
