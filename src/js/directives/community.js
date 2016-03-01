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
      '$scope', 'SessionSvc', 'url', '$location', 'CommunitiesSvc', '$timeout', 'Loading', '$route',
      function ($scope, SessionSvc, url, $location, CommunitiesSvc, $timeout, Loading, $route) {

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
          Loading.create(CommunitiesSvc.findByUrlId($route.current.params.id)).
            then(function(community){
              $scope.community = community;

              Loading.create(community.myAndPublicProjects()).
              then(function (projects){
                getNewsCounts(projects);

                $scope.projects = projects;
              });
            });
        });
      }],
      templateUrl: 'communities/community.html'
    };
  });
