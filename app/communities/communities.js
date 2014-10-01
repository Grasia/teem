'use strict';

angular.module('Pear2Pear.communities', [])
.controller('CommunitiesCtrl', ['$scope', '$location', function($scope, $location){
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
}]);
