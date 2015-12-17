'use strict';

angular.module('Teem')
  .directive('shouldLoginModal', function() {
    return {
      controller: ['$scope', 'SharedState', '$location', function($scope, SharedState, $location){
        $scope.login = function(){
          var currentPath = $location.path();

          SharedState.turnOff('shouldLoginSharedState');
          $location.path('frontpage').search('redirect', currentPath);
        };
        $scope.cancel = function(){
          SharedState.turnOff('shouldLoginSharedState');
        };
      }],
      templateUrl: 'should-login-modal.html'
    };
  });
