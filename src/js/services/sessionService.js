'use strict';

/**
 * @ngdoc function
 * @name Teem.service:SessionSvc
 * @description
 * # SessionSvc service
 * Provides an API to handle SwellRT sessions and network events
 */

angular.module('Teem')
  .factory('SessionSvc', [
    // NotificationSvc has to be added here as dependency to be loaded in the app
  '$q', '$timeout', 'SharedState', 'NotificationSvc', '$locale', 'User',
  '$rootScope',
  function($q, $timeout, SharedState, NotificationSvc, $locale, User,
           $rootScope) {

    var swellRTDef = $q.defer();
    var swellRTpromise = swellRTDef.promise;

    // TODO no restart session without user saying so
    // TODO stop session before start session after a timeout
    // TODO if reconnected, get again all objects
    var status = {
      // Connection status:
      // notConnected: connection has not been atempted
      // connecting: establishing connection
      // connected: everything alright!
      // disconnected: something bad happened
      connection: 'notConnected',
      sync: true,
    };

    SwellRT.ready(function() {
      swellRTDef.resolve();
    });

    // TODO use this to handle fatal exceptions
    var setFatalExceptionHandler = function(handler){
      swellRTpromise.then(function(){
        SwellRT.on(SwellRT.events.FATAL_EXCEPTION, function(){
          $timeout(function(){
            status.connection = 'disconnected';
          });
          handler();
        });
      });
    };

    var sessionDef = $q.defer();
    var sessionPromise = sessionDef.promise;
    var users = {
      password: '$password$',
      callbacks: {
        login: [],
        logout: []
      },
      current: function() {
        // console.log('Deprecated. Use User.currentId() instead');

        return User.currentId();
      },

      currentNick: function() {

        if (User.loggedIn()){
          // console.log('Deprecated. Use User.current().nick instead');

          return User.current().nick;
        }

        return undefined;
      },

      isCurrent: function(user) {
        // console.log('Deprecated. Use User.isCurrent() instead');

        return User.isCurrent(user);
      },
      loggedIn: function() {
        // console.log('Deprecated. Use User.loggedIn() instead');

        return User.loggedIn();
      }
    };

    var registerUser = function(userName, password, email, onSuccess, onError) {
      swellRTpromise.then(function(){
        var data = {
          id: userName,
          password: password,
          email: email,
          locale: $locale.id
        };
        SwellRT.createUser(data, function(res){
          if (res.error) {
            onError(res.error);

          } else if (res.data) {
            onSuccess();

          }
        });
      });
    };

    var stopSession = function(){
      swellRTpromise.then(function(){

        SwellRT.stopSession();
        $rootScope.$broadcast('teem.logout');

        SwellRT.startSession(SwellRTConfig.server, SwellRT.user.ANONYMOUS, '',
          function(){
            sessionDef.resolve(SwellRT);
          }, function(error) {
            console.log(error);
          });

      });
    };

    swellRTpromise.then(function(){
      SwellRT.on(SwellRT.events.NETWORK_CONNECTED, function(){
        $timeout(function(){
          status.connection = 'connected';
        });
      });

      SwellRT.on(SwellRT.events.NETWORK_DISCONNECTED, function(){
        $timeout(function(){

          status.connection = 'disconnected';
        });
      });

      SwellRT.on(SwellRT.events.DATA_STATUS_CHANGED, function(data){
        if (data.inFlightSize === 0 &&
            data.uncommittedSize === 0 &&
            data.unacknowledgedSize  === 0) {

          status.sync = true;
          status.lastSync = new Date();
          $timeout();
        } else {
          status.sync = false;
          $timeout();
        }
      });
    });
    // check variable connecting before calling startSession
    var startSession = function(userName, password, onSuccess, onError) {


      swellRTpromise.then(function(){
        if (status.connection === 'connected') {
          if (userName && __session.address &&
              __session.address === userName) {
            return; // Session already started
          } else {
            SwellRT.stopSession();
            $rootScope.$broadcast('teem.logout');
          }
        }

        status.connection = 'connecting';

        SwellRT.startSession(
          SwellRTConfig.server, userName || SwellRT.user.ANONYMOUS, password || '',
          function(){
            if (userName){
              $rootScope.$broadcast('teem.login');
            }

            sessionDef.resolve(SwellRT);
            onSuccess();

          }, function(error) {
            onError(error);
          });
      });
    };

    var forgottenPassword = function(email, recoverUrl, onSuccess, onError) {
      SwellRT.recoverPassword(email, recoverUrl, onSuccess, onError);
    };

    var recoverPassword = function(id, tokenOrPassword, password, onSuccess, onError) {
      SwellRT.setPassword(id, tokenOrPassword, password, onSuccess, onError);
    };

    function getUserProfile(data, cb) {
      sessionPromise.then(function() {
        SwellRT.getUserProfile(data, cb);
      });
    }

    var updateUserProfile = function(data, cb) {
      sessionPromise.then(function(){
        SwellRT.updateUserProfile(data, cb);
      });
    };

    var autoStartSession = function(){

      status.connection = 'connecting';

      var user, pass;

      // remove this after passwordless user migration is done
      if (localStorage.userId !== undefined) {
        user = localStorage.userId;
        pass = users.password;

        // remove this start session call with default password when passwordless user migration is consideded successful
        // keep SwellRT.resumeSession call
        startSession(
          user, pass, function(){
            // migrating users with default password
            if (user !== undefined) {
              SharedState.set('shouldLoginSharedState', 'migration');
              $timeout();
            }
          },
          // with localStorage.userId but not default password
          function(error) {
            console.log(error);
            delete localStorage.userId;
            autoStartSession();
          });
      } else {
        swellRTpromise.then(function(){
          SwellRT.resumeSession(
            function(){

              // resumeSession also works for anonymous sessions
              if (User.loggedIn()){
                $rootScope.$broadcast('teem.login');
              }

              sessionDef.resolve(SwellRT);
            },
            function(error){
              console.log(error);
              // Anonymous session (user and pass are null)
              startSession(
                user, pass, function(){},
                function(error) {
                  console.log(error);
                });
            });
          });
      }

  };

    function loginRequired(scope, cb) {
      sessionPromise.then(function() {
        if (! users.loggedIn()) {
          SharedState.turnOn('shouldLoginSharedState');
          // Invoque $timout to refresh scope and actually show modal
          $timeout();

          scope.$on('teem.login', cb);
        } else {
          cb();
        }
      });
    }

    return {
      users: users,
      registerUser: registerUser,
      startSession: startSession,
      stopSession: stopSession,
      recoverPassword: recoverPassword,
      forgottenPassword: forgottenPassword,
      getUserProfile: getUserProfile,
      updateUserProfile: updateUserProfile,
      loginRequired: loginRequired,
      setFatalExceptionHandler: setFatalExceptionHandler,
      status: status,
      // TODO refactor with Prototype version of proxy objects to avoid the use of onLoad
      onLoad: function(f) {
        if (status.connection === 'notConnected' ||
            status.connection === 'disconnected'){
          autoStartSession();
        }

        sessionPromise.then(f);
        return sessionPromise;
      }
    };
  }]);
