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
      .when('/communities', {
        templateUrl: 'communities/index.html',
        controller: 'CommunitiesCtrl'
      });
  }])
  .controller('CommunitiesCtrl', [
  '$scope', 'SwellRTSession', 'url', '$location', 'CommunitiesSvc', '$timeout',
  function ($scope, SwellRTSession, url, $location, CommunitiesSvc, $timeout) {

    $scope.newCommunityName = {
      name : ''
    };

    // FIXME: model prototype
    $scope.urlId = url.urlId;

    // To be defined in SwellRTSession.onLoad callback when SwellRT is ready
    $scope.refreshCommunityList = function(){};

    SwellRTSession.onLoad(function(){

      $scope.refreshCommunityList = function() {
        CommunitiesSvc.all().then(function(communities){
          $scope.communities = communities;
        });
      };

      $scope.refreshCommunityList();

      $scope.create = function(name) {
        CommunitiesSvc.create(
          { name: name || $scope.newCommunityName.name },
          function(community) {
            // TODO: bring following call to controller code
            $scope.showProjects(community.id);
          });
      };
    });

    $scope.search = function() {
      $scope.searching = true;
      // Need the timeout for the focus to work
      $timeout(function() {
        document.querySelector('.community-search input').focus();
      });
    };

    $scope.new_ = function() {
      $scope.creating = true;
      // Need the timeout for the focus to work
      $timeout(function() {
        document.querySelector('.community-search input').focus();
      });
    };

    $scope.showProjects = function(id) {
      CommunitiesSvc.setCurrent(url.urlId(id));
      $location.path('/communities/' + url.urlId(id) + '/projects').search('section', null);
    };

    $scope.$on('mobile-angular-ui.state.changed.uiSidebarLeft', function() {
      $scope.refreshCommunityList();
    });

  }]);
