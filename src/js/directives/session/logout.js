'use strict';

angular.module('Teem')
  .directive('sessionLogout',
  (SessionSvc, $location) => {

    'ngInject';

    function link (scope, element) {

      element.on('click', function() {

        SessionSvc.stopSession();
        $location.path('/');
      });
    }

    return {
      link
    };
  });
