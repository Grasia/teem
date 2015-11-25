'use strict';

angular.module('Pear2Pear')
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

     function create(promise) {
       on();

       return promise.then(success, error);
     }

     return {
       create: create,
       status: status
     };
   }]);
