'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.service:url
 * @description
 * # url service
 * It provides several url common functions to be used by several controllers
 */

angular.module('Pear2Pear')
  .factory('url', ['base64', function(base64) {
    return {
      urlId : function(id){
        if (id === undefined) { return ''; }

        return base64.urlencode(id);
      }
    };
  }]);
