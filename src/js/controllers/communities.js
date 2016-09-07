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
            var commsPromise = CommunitiesSvc.participating({ projectCount: true });
            Loading.show(commsPromise).
            then(function(communities){
              $scope.communities = communities;
              $scope.bussyPagination = false;
              $scope.commsNextPage = commsPromise.next;
            });
          });

          break;

          default:

          var commsPromise = CommunitiesSvc.all({ projectCount: true });

          Loading.show(commsPromise).
          then(function(communities) {
            $scope.communities = communities;
            $scope.bussyPagination = false;
            $scope.commsNextPage = commsPromise.next;
          });
        }
      }
    }


    $scope.getCommunitiesPage = function() {
      if ($scope.bussyPagination){
        return;
      }
      if ($scope.communities && typeof $scope.commsNextPage === 'function'){
        $scope.bussyPagination = true;
        var commsPromise = $scope.commsNextPage();
        commsPromise.then((communities)=>{

          console.log(communities);
          if (communities.length > 0) {
            Array.prototype.push.apply(
              $scope.communities,
              communities);

              $scope.commsNextPage = commsPromise.next;
              $scope.bussyPagination = false;
          }

        });
      }
    };

    SessionSvc.onLoad(initialize);

  }]);
