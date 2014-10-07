'use strict';

angular.module('Pear2Pear.communities', [])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/communities', {
      templateUrl: 'communities/index.html',
      controller: 'CommunitiesCtrl'
    }).
    when('/communities/new', {
      templateUrl: 'communities/new.html',
      controller: 'CommunitiesCtrl'
    }).
    when('/communities/:id/edit', {
      templateUrl: 'communities/edit.html',
      controller:'CommunitiesCtrl'
    });
}])
.controller('CommunitiesCtrl', ['$scope', '$location', '$routeParams', function($scope, $location, $routeParams){
  $scope.communities = [
    {
      id: 1,
      name: "P2Pvalue"
    },
    {
      id: 2,
      name: "Universidad Complutense de Madrid"
    },
    {
      id: 3,
      name: "Tabacalera"
    }
  ];

  var getCommunity = function() {
    if ($routeParams.id) {
      return {
        name: "P2Pvalue",
        participants: [
          {
            name: "Marco"
          },
          {
            name: "Primavera"
          },
          {
            name: "Mayo"
          },
          {
            name: "Samer"
          }
        ]
      };
    } else {
      return {};
    }
  };

  $scope.community = getCommunity();

  $scope.index = function() {
    $location.path('/communities');
  };

  $scope.new  = function() {
    $location.path('/communities/new');
  };

  $scope.edit = function(id) {
    $location.path('/communities/' + id + '/edit');
  };

  $scope.show_tasks = function(id) {
    $location.path('/communities/' + id + '/tasks');
  };

  $scope.save = function() {
    // TODO
    $scope.index();
  };
}]);
