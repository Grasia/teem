'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:CommunitiesCtrl
 * @description
 * # CommunitiesCtrl
 * Controller of the Teem
 */
angular.module('Teem')
  .directive('community', function() {
    return {
      controller: [
      '$scope', 'SessionSvc', 'url', '$location', 'CommunitiesSvc', '$timeout',
      'Loading', '$route', 'NewForm',
      function ($scope, SessionSvc, url, $location, CommunitiesSvc, $timeout,
                Loading, $route, NewForm) {

        var edittingTitle = false;

        // get the count of new edits and chats for a list of projects and store them in the project properties
        // Refactoring...
        function getNewsCounts(projs) {
          angular.forEach(projs, function(proj) {
            if (proj.contributors.indexOf(SessionSvc.users.current()) > -1) {
              proj.isContributor = true;
            }
          });
        }

        SessionSvc.onLoad(function(){
          Loading.show(CommunitiesSvc.findByUrlId($route.current.params.id)).
            then(function(community){
              $scope.community = community;

              Loading.show(community.myAndPublicProjects()).
              then(function (projects){
                getNewsCounts(projects);

                $scope.projects = projects;
              });
            });
        });

        NewForm.initialize($scope, 'community');

        $scope.edittingTitle = function() {
          return edittingTitle || $scope.isNew();
        };

        $scope.showEditTitle = function() {
          edittingTitle = true;
        };

        $scope.hideEditTitle = function() {
          edittingTitle = false;
        };
      }],
      templateUrl: 'communities/community.html'
    };
  });
