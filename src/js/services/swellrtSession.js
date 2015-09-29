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
    'SwellRTSession', ['loading', '$q', '$timeout', function(loading, $q, $timeout){

      var swellRTDef = $q.defer();
      var swellRTpromise = swellRTDef.promise;

      window.onSwellRTReady = function(){
        swellRTDef.resolve();
        // TODO handle loading correctly
        loading.hide();
      };

      var sessionConnected = false;
      var connecting = false;


      // TODO use this to handle fatal exceptions
      var setFatalExceptionHandler = function(handler){
        swellRTpromise.then(function(){
          SwellRT.on(SwellRTevents.FATAL_EXCEPTION, handler);
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
          return users.current() != 'undefined' && users.current() !== null;
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

      var startSession = function(userName, password, onSuccess, onError) {
        swellRTpromise.then(function(){
          // TODO: call loading functions from controller code
          loading.show();

          connecting = true;

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

              SwellRT.on(SwellRT.events.NETWORK_CONNECTED, function(){
                sessionConnected = true;
                sessionDef.resolve(SwellRT);
                onSuccess();
              });

              SwellRT.on(SwellRT.events.NETWORK_DISCONNECTED, function(){
                sessionConnected = false;
              });

              connecting = false;
              loading.hide();
            }, function() {
              onError();
              connecting = false;
              loading.hide();
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
                loading.hide();
              });
          },
          function(error) {
            console.log(error);
            loading.hide();
          });
      };

      return {
        registerUser: registerUser,
        startSession: startSession,
        stopSession: stopSession,
        setFatalExceptionHandler: setFatalExceptionHandler,
        // TODO refactor with Prototype version of proxy objects to avoid the use of onLoad
        onLoad: function(f) {
          if (!sessionConnected && !connecting){
            autoStartSession();
          }
          sessionDef.promise.then(f);
        }
      };
    }]);
