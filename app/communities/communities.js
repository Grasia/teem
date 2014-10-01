'use strict';

angular.module('Pear2Pear.communities', [])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/communities', {
      templateUrl: 'communities/index.html',
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

  $scope.community = {
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

  $scope.edit = function(id) {
    $location.path('/communities/' + id + '/edit');
  };
}]);
