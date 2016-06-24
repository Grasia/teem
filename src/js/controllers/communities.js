'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:CommunitiesCtrl
 * @description
 * # CommunitiesCtrl
 * Controller of the Teem
 */
angular.module('Teem')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/communities', {
        controller: 'CommunitiesCtrl',
        templateUrl: 'communities/index.html'
      })
      .when('/home/communities', {
        controller: 'CommunitiesCtrl',
        templateUrl: 'communities/index.html'
      })
      .when('/communities/new', {
        templateUrl: 'communities/index.html'
      })
      .when('/communities/:id', {
        templateUrl: 'communities/show.html'
      });
  }])
  .controller('CommunitiesCtrl', [
  'SessionSvc', '$scope', '$location', 'Loading', 'CommunitiesSvc',
  function (SessionSvc, $scope, $location, Loading, CommunitiesSvc) {

    if ($location.path() === '/home/communities') {
      $scope.context = 'home';
    } else {
      $scope.context = 'public';
    }
    let home = $scope.context === 'home' ? 'home.' : '';
    $scope.title = `community.index.${home}title`;

    function initialize() {
      switch ($scope.context) {

        case 'home':
          SessionSvc.loginRequired($scope, function() {
            Loading.show(CommunitiesSvc.participating({ projectCount: true })).
              then(function(communities){
                $scope.communities = communities;
              });
            });

          break;
        default:
          Loading.show(CommunitiesSvc.all({ projectCount: true })).
            then(function(communities) {
              $scope.communities = communities;
            });
      }
    }

    SessionSvc.onLoad(initialize);
    $scope.$on('swellrt.prepare-login', initialize);

  }]);
