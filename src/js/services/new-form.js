'use strict';

angular.module('Teem')
  .factory('NewForm', [
  '$location', '$window', '$rootScope', 'SharedState',
  function($location, $window, $rootScope, SharedState) {
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

                var value;

                try {
                  value = JSON.parse(i);
                }
                // if it is an existing user
                catch (e) {
                  scope[objectName].addParticipant(i);
                  return;
                }

                // if it is an email address
                if (typeof value === 'object'){
                  if (value.email) {
                    emails.push(value.email);
                  }
                }
              });
            }

            if (emails.length > 0){
              SwellRT.invite(emails, scope[objectName].url(),
              // project.title || community.name
               scope[objectName].title || scope[objectName].name, function(s){console.log(s);}, function(e){console.log('error:', e);});
            }

            $rootScope.$broadcast('teem.' + objectName + '.join');
          }
        };

        $rootScope.$on('$routeChangeStart', function(event, next, current) {
          if (current.params.form === 'new') {
            delete current.params.form;
          }
        });


    function initialize(s, o) {
      scope = s;
      objectName = o;

      scope.newFormObjectName = o;
      Object.assign(scope, scopeFn);
      SharedState.set('modalSharedState', 'newForm');
    }

    return {
      initialize
    };
  }]);
