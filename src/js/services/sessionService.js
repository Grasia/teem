'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.service:SessionSvc
 * @description
 * # SessionSvc service
 * Provides an API to handle SwellRT sessions and network events
 */

angular.module('Pear2Pear')
  .factory('SessionSvc', [
  '$q', '$timeout', 'SharedState', 'NotificationSvc',
  function($q, $timeout, SharedState, NotificationSvc) {

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

      window.onSwellRTReadyCalled = false;

      window.onSwellRTReady = function(){
        swellRTDef.resolve();
        window.onSwellRTReadyCalled = true;
      };

      if (window.SwellRT && !window.onSwellRTReadyCalled){
        window.onSwellRTReady();
      }



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
      var users = {
        password: '$password$',
        current: function() {
          return window.localStorage.getItem('userId');
        },
        setCurrent: function(name) {
          var cleanedName = name ? name.trim() : name;

          return window.localStorage.setItem('userId', cleanedName);
        },
        isCurrent: function(user) {
          return user === users.current();
        },
        loggedIn: function() {
          return users.current() !== 'undefined' && users.current() !== null;
        },
        clearCurrent: function() {
          window.localStorage.removeItem('userId');
        }
      };

      var registerUser = function(userName, password, onSuccess, onError) {
        swellRTpromise.then(function(){
          SwellRT.registerUser(SwellRTConfig.server, userName, password, onSuccess, onError);
        });
      };

      var stopSession = function(){
        swellRTpromise.then(function(){
          SwellRT.stopSession();
          users.clearCurrent();
          NotificationSvc.unregister(
            undefined,
            function(error){
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
        status.connection = 'connecting';

        swellRTpromise.then(function(){
          if (status.connection === 'connected') {
            if (userName && __session.address &&
                __session.address.split('@')[0] === userName.split('@')[0]) {
              return; // Session already started
            }
            // close other user's session
            else {
              stopSession();
            }
          }

          SwellRT.startSession(
            SwellRTConfig.server, userName || SwellRT.user.ANONYMOUS, password || '',
            function(){
              SwellRTConfig.swellrtServerDomain = __session.domain;
              if (userName){
                users.setCurrent(__session.address);
                NotificationSvc.register(userName);
              } else {
                users.clearCurrent();
                NotificationSvc.unregister(
                  undefined,
                  function(error){
                    console.log(error);
                  });
              }

              sessionDef.resolve(SwellRT);
              onSuccess();

              status.connection = 'connected';
            }, function() {
              onError();
              status.connection = 'disconnected';
            });
        });
      };

      var autoStartSession = function(){
        var user, pass;

        if (users.current() !== null) {
          user = users.current();
          pass = users.password;
        }

        startSession(
          user, pass, function(){
            $timeout();
          },
          function(error) {
            console.log(error);
          });
      };

      function loginRequired(cb) {
        if (! users.loggedIn()) {
          SharedState.turnOn('shouldLoginSharedState');
          // Invoque $timout to refresh scope and actually show modal
          $timeout();
        } else {
          cb();
        }
      }

      return {
        users: users,
        registerUser: registerUser,
        startSession: startSession,
        stopSession: stopSession,
        loginRequired: loginRequired,
        setFatalExceptionHandler: setFatalExceptionHandler,
        status: status,
        // TODO refactor with Prototype version of proxy objects to avoid the use of onLoad
        onLoad: function(f) {
          if (status.connection === 'notConnected' ||
              status.connection === 'disconnected'){
            autoStartSession();
          }
          sessionDef.promise.then(f);
        }
      };
    }]);
