
'use strict';

angular.module('Pear2Pear')
  .directive('loading', [
  'Loading',
  function(Loading) {
    return {
      scope: true,
      link: function(scope){
        scope.loading = Loading.status;
      },
      templateUrl: 'loading.html'
    };
  }]);
