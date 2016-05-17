'use strict';

/**
 * @ngdoc function
 * @name Teem.service:url
 * @description
 * # url service
 * It provides several url common functions to be used by several controllers
 */

angular.module('Teem')
  .factory('url', [
  'base64', '$location',
  function(base64, $location) {

    class Url {

      get urlId () {
        if (! this._urlId) {
          this._urlId = base64.urlencode(this.id);
        }

        return this._urlId;
      }

      path () {
        return this.pathPrefix + this.urlId;
      }

      url () {
        // using location.host instead of $location.host because
        // it gives port information when needed
        return $location.protocol() + '://' +  location.host  + this.path();
      }

      static urlId (id) {
        if (id === undefined) { return ''; }

        return base64.urlencode(id);
      }

      static decodeUrlId (urlId) {
        if (urlId === undefined) { return ''; }

        return base64.urldecode(urlId);
      }
    }

    return Url;
  }]);
