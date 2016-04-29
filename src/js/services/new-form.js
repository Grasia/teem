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

            var emails = [];

            scope.invite.selected.forEach(function(i){

              // if it is an email address
              if (typeof i === 'object' && i.email) {
                emails.push(i.email);
              }
              // if it is an existing user
              else {
                if (objectName === 'project') {
                  scope.project.addContributor(i);
                } else if (objectName === 'community'){
                  scope.community.addParticipant(i);
                }
              }

            });

            SwellRT.invite(emails, scope.linkCurrentProject());

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
