
'use strict';

angular.module('Pear2Pear')
  .directive('loading', [
  function() {
    return {
      scope: true,
      link: function(scope){
        scope.loading = false;
      },
      templateUrl: 'loading.html'
    };
  }]);
