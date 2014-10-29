'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:CommunitiesCtrl
 * @description
 * # CommunitiesCtrl
 * Controller of the Pear2Pear
 */
angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/communities', {
        templateUrl: 'views/communities/index.html',
        controller: 'CommunitiesCtrl'
      }).
      when('/communities/new', {
        templateUrl: 'views/communities/new.html',
        controller: 'CommunitiesCtrl'
      }).
      when('/communities/:id/edit', {
        templateUrl: 'views/communities/edit.html',
        controller:'CommunitiesCtrl'
      });
  }])
  .controller('CommunitiesCtrl', ['$scope', '$location', '$routeParams', function($scope, $location, $routeParams){
    $scope.communities = [
      {
        id: 1,
        name: 'P2Pvalue'
      },
      {
        id: 2,
        name: 'Universidad Complutense de Madrid'
      },
      {
        id: 3,
        name: 'Tabacalera'
      }
    ];
  
    //TODO backend
    $scope.app = {};
    
    $scope.app.users = [
      {
        name: 'Marco'
      },
      {
        name: 'Primavera'
      },
      {
        name: 'Mayo'
      },
      {
        name: 'Samer'
      },
      {
        name: 'Pablo'
      },
      {
        name: 'Tapi'
      },
      {
        name: 'Javi'
      },
      {
        name: 'Tenorio'
      }
    ];
    
    var getCommunity = function() {
      if ($routeParams.id) {
        return {
          name: 'P2Pvalue',
          participants: [
            $scope.app.users[0],
            $scope.app.users[1],
            $scope.app.users[2],
            $scope.app.users[3]
          ]
        };
      } else {
        return {};
      }
    };
  
    $scope.community = getCommunity();
    
    $scope.app.noParticipants = $scope.app.users.filter( 
      function (elem) {
        return ($scope.community.participants)? $scope.community.participants.indexOf(elem)== -1 : false;
      }
    );
    $scope.index = function() {
      $location.path('/communities');
    };
  
    $scope.new  = function() {
      $location.path('/communities/new');
    };
  
    $scope.edit = function(id) {
      $location.path('/communities/' + id + '/edit');
    };
  
    $scope.showTasks = function(id) {
      $location.path('/communities/' + id + '/tasks');
    };
  
    $scope.save = function() {
      // TODO
      $scope.index();
    };
  }]);
