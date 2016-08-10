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
        controller: 'CommunitiesCtrl',
        templateUrl: 'communities/index.html'
      })
      .when('/communities/:id', {
        templateUrl: 'communities/show.html'
      });
  }])
  .controller('CommunitiesCtrl', [
  'SessionSvc', '$scope', '$location', 'Loading', 'CommunitiesSvc', '$route',
  function (SessionSvc, $scope, $location, Loading, CommunitiesSvc, $route) {

    if ($location.path() === '/home/communities') {
      $scope.context = 'home';
    } else {
      $scope.context = 'public';
    }

    if ($location.path() === '/communities/new') {
      SessionSvc.loginRequired($scope, function() {
        CommunitiesSvc.create({}, function(c) {
          $location.path(c.path()).search('form', 'new');
        });
      },
      {
        form: 'register',
        message: 'new_community'
      });
    }

    $scope.bussyPagination = true;

    function initialize() {
      if (!$route.current.params.id && $location.path() !== '/communities/new') {

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
            $scope.bussyPagination = false;
          });
        }
      }
    }


    $scope.getCommunitiesPage = function() {
      if ($scope.bussyPagination){
        return;
      }
      if ($scope.communities && typeof $scope.communities.next === 'function'){
        $scope.bussyPagination = true;
        $scope.communities.next().then((communities)=>{

          Array.prototype.push.apply(
            $scope.communities,
            communities);

          $scope.bussyPagination = false;
        });
      }
    };

    SessionSvc.onLoad(initialize);

  }]);
