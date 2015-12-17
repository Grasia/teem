'use strict';

/**
 * @ngdoc function
 * @name Teem.service:url
 * @description
 * # url service
 * It provides several url common functions to be used by several controllers
 */

angular.module('Teem')
  .factory('url', ['base64', function(base64) {
    return {
      urlId : function(id){
        if (id === undefined) { return ''; }

        return base64.urlencode(id);
      },
      decodeUrlId : function(urlId){
        if (urlId === undefined) { return ''; }

        return base64.urldecode(urlId);
      }
    };
  }]);
