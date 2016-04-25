'use strict';

/**
 * @ngdoc function
 * @name Teem.service:User
 * @description
 * # User service
 * Methods about users
 */

angular.module('Teem')
  .factory('User', [ '$q',
  function($q) {
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
        if (! this.loggedIn()) {
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


      static usersLike (search){
        var query = {
          _aggregate: [
            {$match: {
              'root.type': 'project',
              'root.shareMode': 'public',
              'participants': {$regex: search, $options: 'i'}
            }},
            {$unwind: '$participants'},
            {$group :
              {_id:'$participants',
              count: {$sum: 1 }}
            },
            {$match:
              {_id: {$regex: search, $options: 'i'}}
            }
          ]};

          var def = $q.defer();

          SwellRT.query(query, function(a){
            def.resolve(a.result);
          }, function(error){
            def.reject(error);
          });

          return def.promise;
        }
      }

    return User;
  }]);
