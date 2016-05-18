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

            if (scope.invite) {
              scope.invite.selected.forEach(function(i){

                // if it is an email address
                if (typeof i === 'object'){
                  var value = JSON.parse(i);
                  if (value.email) {
                    emails.push(value.email);
                  }
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
            }

            if (emails.length > 0){
              SwellRT.invite(emails, scope.project.url(), scope.project.title);
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
