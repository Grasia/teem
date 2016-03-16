'use strict';

angular.module('Teem')
  .factory('NewForm', [
  '$location', '$window', '$rootScope',
  function($location, $window, $rootScope) {
    var scope,
        objectName,
        scopeFn = {
          isNew () {
            return $location.search().form === 'new';
          },
          cancelNew () {
            scope[objectName].delete();

            $location.search('form', undefined);

            $window.history.back();
          },
          confirmNew () {
            $location.search('form', undefined);
            $rootScope.$broadcast('teem.project.join');
          }
        };

    function initialize(s, o) {
      scope = s;
      objectName = o;

      Object.assign(scope, scopeFn);
    }

    return {
      initialize
    };
  }]);
