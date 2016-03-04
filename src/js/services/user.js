'use strict';

/**
 * @ngdoc function
 * @name Teem.service:User
 * @description
 * # User service
 * Methods about users
 */

angular.module('Teem')
  .factory('User', [
  function() {
    class User {

      static currentId () {
        if (typeof(__session) === 'undefined' ||
            __session === null ||
            typeof(__session.address) === 'undefined') {
          return undefined;
        }

        if (__session.address.match(/^_anonymous_/)) {
          return undefined;
        }

        return __session.address;
      }

      static current () {
        if (! this.loggedIn()) {
          return undefined;
        }

        return new User(this.currentId());
      }

      static isCurrent (id) {
        if (! this.loggedIn) {
          return false;
        }

        return id === this.currentId();
      }

      static loggedIn () {
        return this.currentId() !== undefined;
      }

      constructor (id) {
        this._id = id;
      }

      get id () { return this._id; }

      get nick () {
        return this.id.split('@')[0];
      }
    }

    return User;
  }]);
