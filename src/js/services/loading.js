'use strict';

angular.module('Teem')
  .factory('Loading', [
  '$timeout',
   function($timeout) {
     var status = {
       count: 0,
       show: false
     };

     function on() {
       status.count ++;
       status.show = true;
       // Trigger angular digest
       $timeout();
     }

     function off() {
       status.count --;

       if (status.count === 0) {
         status.show = false;

         // Trigger angular digest
         $timeout();
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
