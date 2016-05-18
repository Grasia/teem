'use strict';

angular.module('Teem')
  .factory('Loading', [
  '$timeout', '$window',
   function($timeout, $window) {
     var status = {
       count: 0,
       show: false
     };

     function on() {
       status.count ++;
       status.show = true;
       // Trigger angular digest
       $timeout();

       // Tell prerender to wait for the SwellRT query
       $window.prerenderReady = false;
     }

     function off() {
       status.count --;

       if (status.count === 0) {
         status.show = false;

         // Trigger angular digest
         $timeout();

         // Tell prerender everything is fine
         $window.prerenderReady = true;
       }
     }

     function success() {
       off();
     }

     function error() {
       off();
     }

     function show(promise) {
       on();

       promise.then(success, error);

       return promise;
     }

     return {
       show: show,
       status: status
     };
   }]);
