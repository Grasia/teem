'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.service:Pear
 * @description
 * # Pear service
 * Provides controllers with a data model for pear to pear app
 * It serves as an abstraction between Pear data and backend (SwellRT)
 */

angular.module('Pear2Pear')
  .factory('common', [function() {
    return {
      time : {
        hour: function(date){
          return date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
        }
      }
    };
  }]);
