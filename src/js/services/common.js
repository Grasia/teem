'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.service:common
 * @description
 * # common service
 * It provides several common functions to be used by several controllers
 */

angular.module('Pear2Pear')
  .factory('common', [ function() {
    return {
      time : {
        hour: function(date){
          return date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
        },
        date: function(date){
          var options = { month: 'long', day: 'numeric' };
          return date.toLocaleDateString(undefined, options);
        }
      }
    };
  }]);
