'use strict';

angular.module('Teem')
  .factory('Participation', [
  'User', '$rootScope',
  function(User, $rootScope) {

    class ReadOnly {

      isParticipant (user = User.currentId()) {
        if (! user) {
          return false;
        }

        return this._participants.indexOf(user) > -1;
      }

      participantCount () {
        return this._participants.reduce(function(a,b){
          // do not count participants of the form @domain that represents that it is a public wave.
          return a + (/.+@.+/.test(b)? 1 : 0);
        }, 0);
      }
    }

    class ReadWrite {

      addParticipant (user) {
        if (!user){
          if (! User.loggedIn()) {
            return;
          }

          user = User.currentId();
        }

        if (this.isParticipant(user)) {
          return;
        }

        this._participants.push(user);

        if (user === User.currentId()) {
          $rootScope.$broadcast('teem.' + this.type + '.join');
        }
      }

      removeParticipant (user) {
        if (!user){
          if (! User.loggedIn()) {
            return;
          }

          user = User.currentId();
        }

        if (! this.isParticipant(user)) {
          return;
        }

        this._participants.splice(
          this._participants.indexOf(user),
          1);

          if (user === User.currentId()) {
            $rootScope.$broadcast('teem.' + this.type + '.leave');
          }
      }

      toggleParticipant (user) {
        if (! user){
          if (! User.loggedIn()) {
            return;
          }

          user = User.currentId();
        }

        if (this.isParticipant(user)) {
          this.removeParticipant(user);
        } else {
          this.addParticipant(user);
        }
      }
    }

    return {
      ReadOnly,
      ReadWrite
    };
  }
]);
