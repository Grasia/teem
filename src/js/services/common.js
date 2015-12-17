'use strict';

/**
 * @ngdoc function
 * @name Teem.service:time
 * @description
 * # time service
 * It provides several time common functions to be used by several controllers
 */

angular.module('Teem')
  .factory('time', [ function() {
    return {
      hour: function(date){
        return date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
      },
      date: function(date){
        var options = { month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      }
    };
  }]);
