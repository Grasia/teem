'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the Teem
 */

angular.module('Teem')
  .directive('searchResults', ['config', 'Url', 'SessionSvc',
   'CommunitiesSvc', 'ProjectsSvc',
    function(config, Url, SessionSvc, CommunitiesSvc, ProjectsSvc){
    return {
      link: function(scope, element, attrs){

        scope.communities = [];

        scope.projects = [];

        // to distinguis new projects and communities after queries
        scope.fetchedIds = new Set();

        scope.search = {
          input: ''
        };

        function initialize (){

          scope.$watch(attrs.query, function(value){

            if (!value || value.length < 2) {
              return;
            }

            var commsPromise = CommunitiesSvc.all({
              nameLike: value
            });

            commsPromise.then(function(communities) {

              communities.forEach(function(c){
                if (!scope.fetchedIds.has(c.id)){
                  scope.communities.push(c);
                  scope.fetchedIds.add(c.id);
                }
              });

            });

            var projsPromise = ProjectsSvc.all({
              titleLike: value,
              projection: ProjectsSvc.projectListProjection
            });

            projsPromise.then(function(projects) {

              projects.forEach(function(p){
                if (!scope.fetchedIds.has(p.id)){
                  scope.projects.push(p);
                  scope.fetchedIds.add(p.id);
                }
              });

            });
          });
        }

        SessionSvc.onLoad(initialize);

      },
      templateUrl: 'search-results.html'
    };
  }]);
