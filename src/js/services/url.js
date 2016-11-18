'use strict';

/**
 * @ngdoc function
 * @name Teem.service:url
 * @description
 * # url service
 * It provides several url common functions to be used by several controllers
 */

angular.module('Teem')
  .factory('Url', [
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

      url (campaign) {
        // using location.host instead of $location.host because
        // it gives port information when needed
        var url = $location.protocol() + '://' +  location.host  + this.path();
        if (campaign){
          url += '?pk_campaign=' + campaign;
        }
        return url;
      }

      static encode (id) {
        if (id === undefined) { return ''; }

        return base64.urlencode(id);
      }

      static decode (urlId) {
        if (urlId === undefined) { return ''; }

        return base64.urldecode(urlId);
      }
    }

    return Url;
  }]);
