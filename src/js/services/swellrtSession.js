'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.service:SwellRTSession
 * @description
 * # SwellRTSession service
 * Provides an API to handle SwellRT sessions and network events
 */

angular.module('Pear2Pear')
  .factory(
    'SwellRTSession', ['$q', '$timeout', 'SharedState', function($q, $timeout, SharedState){

      var swellRTDef = $q.defer();
      var swellRTpromise = swellRTDef.promise;

      window.onSwellRTReadyCalled = false;

      window.onSwellRTReady = function(){
        swellRTDef.resolve();
        window.onSwellRTReadyCalled = true;
      };

      if (window.SwellRT && !window.onSwellRTReadyCalled){
        window.onSwellRTReady();
      }

      var sessionConnected = false;
      var dataSync = true;
      var lastDataSync;
      var connecting = false;


      // TODO use this to handle fatal exceptions
      var setFatalExceptionHandler = function(handler){
        swellRTpromise.then(function(){
          SwellRT.on(SwellRT.events.FATAL_EXCEPTION, function(){
            $timeout(function(){
              sessionConnected = false;
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
        });
      };

      swellRTpromise.then(function(){
        SwellRT.on(SwellRT.events.NETWORK_CONNECTED, function(){
          $timeout(function(){
            sessionConnected = true;
          });
        });

        SwellRT.on(SwellRT.events.NETWORK_DISCONNECTED, function(){
          $timeout(function(){
            sessionConnected = false;
          });
        });

        var dataStatusTimeout;

        SwellRT.on(SwellRT.events.DATA_STATUS_CHANGED, function(data){
          if (data.inFlightSize === 0 &&
              data.uncommittedSize === 0 &&
              data.unacknowledgedSize  === 0) {

            dataSync = true;
            lastDataSync = new Date();
            if (dataStatusTimeout){
              $timeout.cancel(dataStatusTimeout);
              dataStatusTimeout = undefined;
            }
          }
          else {
            if (!dataStatusTimeout){
              dataStatusTimeout = $timeout(function(){
                dataSync = false;
              }, 3000);
            }
          }
        });
      });
      // check variable connecting before calling startSession
      var startSession = function(userName, password, onSuccess, onError) {
        connecting = true;
        swellRTpromise.then(function(){
          if (sessionConnected) {
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
              } else {
                users.clearCurrent();
              }

              sessionDef.resolve(SwellRT);
              onSuccess();

              sessionConnected = true;
              connecting = false;
            }, function() {
              onError();
              connecting = false;
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
            $timeout(
              function() {
              });
          },
          function(error) {
            console.log(error);
          });
      };

      function loginRequired(cb) {
        if (! users.loggedIn()) {
          SharedState.turnOn('shouldLoginSharedState');
          // Invoque $timout to refresh scope and actually show modal
          $timeout(function() {
            return;
          });
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
        // TODO no restart session without user saying so
        // TODO stop session before start session after a timeout
        // TODO if reconnected, get again all objects
        status: {
          isConnected: function(){
            return sessionConnected;
          },
          isDataSync: function(){
            return dataSync;
          },
          lastDataSync: function(){
            return lastDataSync;
          }
        },

        // TODO refactor with Prototype version of proxy objects to avoid the use of onLoad
        onLoad: function(f) {
          if (!sessionConnected && !connecting){
            autoStartSession();
          }
          sessionDef.promise.then(f);
        }
      };
    }]);
