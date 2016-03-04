'use strict';

angular.module('Teem')
  .factory('NewForm', [
  '$location', '$window',
  function($location, $window) {
    var scope,
        objectName,
        scopeFn = {
          isNew () {
            return $location.search().form === 'new';
          },
          cancelNew () {
            scope[objectName].delete();

            $window.history.back();
          },
          confirmNew () {
            $location.search('form', undefined);
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
