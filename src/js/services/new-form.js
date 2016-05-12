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

            // TODO fix with community invite
            if (objectName === 'project') {
              scope.invite.selected.forEach(function(i){
                scope.project.addContributor(i);
              });
            }

            $rootScope.$broadcast('teem.' + objectName + '.join');
          }
        };

    function initialize(s, o) {
      scope = s;
      objectName = o;

      scope.newFormObjectName = o;
      Object.assign(scope, scopeFn);
    }

    return {
      initialize
    };
  }]);
