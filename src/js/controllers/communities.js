'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:CommunitiesCtrl
 * @description
 * # CommunitiesCtrl
 * Controller of the Pear2Pear
 */
angular.module('Pear2Pear')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/communities/:new?', {
        templateUrl: 'communities/index.html',
        controller: 'CommunitiesCtrl'
      });
  }])
  .controller('CommunitiesCtrl', [
  '$scope', 'SessionSvc', 'url', '$location', 'CommunitiesSvc', '$timeout', '$routeParams', 'Loading',
  function ($scope, SessionSvc, url, $location, CommunitiesSvc, $timeout, $routeParams, Loading) {

    $scope.newCommunityName = {
      name : ''
    };

    // FIXME: model prototype
    $scope.urlId = url.urlId;


    SessionSvc.onLoad(function(){
      Loading.create(CommunitiesSvc.all()).
        then(function(communities){
          $scope.communities = communities;
        });

      $scope.create = function(name) {
        CommunitiesSvc.create(
          { name: name || $scope.newCommunityName.name },
          function(community) {
            // TODO: bring following call to controller code
            $scope.showProjects(community.id);
          });
      };
    });

    $scope.new_ = function() {
      $scope.creating = true;
      // Need the timeout for the focus to work
      $timeout(function() {
        document.querySelector('.community-search input').focus();
      });
    };

    if ($routeParams.new) {
      $scope.new_();
    }

    $scope.reset = function() {
      if ($scope.newCommunityName.name === '') {
        $scope.creating = false;
      }
    };

    $scope.showProjects = function(id) {
      CommunitiesSvc.setCurrent(url.urlId(id));
      $location.path('/communities/' + url.urlId(id) + '/projects').search('section', null);
    };
  }]);
