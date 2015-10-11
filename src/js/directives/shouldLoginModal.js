'use strict';

angular.module('Pear2Pear')
  .directive('shouldLoginModal', function() {
    return {
      controller: ['$scope', 'SharedState', '$location', function($scope, SharedState, $location){
        $scope.login = function(){
          SharedState.turnOff('shouldLoginSharedState');
          $location.path('frontpage');
        };
        $scope.cancel = function(){
          SharedState.turnOff('shouldLoginSharedState');
        };
      }],
      templateUrl: 'should-login-modal.html'
    };
  });
