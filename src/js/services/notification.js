'use strict';

/**
 * @ngdoc function
 * @name Teem.service:NotificationSvc
 * @description
 * # Notification service
 */

angular.module('Teem')
  .factory( 'NotificationSvc', [function(){

    var push;
    var registrationId;

    var register = function(userName) {
      if (window.cordova) {
        push = PushNotification.init(
          { "android": {"senderID": "843281102628"}});

        push.on('registration', function(data) {
          console.log('Registration:', data);
          registrationId = data.registrationId;
          // TODO register user with device id:
          // theGCMServer.registerUser(userName, registrationId);
        });

        push.on('error', function(e) {
          console.log(e);
        });
      }
    }

    var onNotification = function(callback) {
      if(window.cordova){
        if (push === undefined) {
          throw 'Push notifications have not been initialized';
        }
        push.on('notification', function(data) {
          console.log('Notification:', data);
          callback(data);
        });
      }
    }

    var unregister = function(onSuccess, onError){
      if(window.cordova){
        if (push === undefined) {
          throw 'Push notifications have not been initialized';
        }
        push.unregister(onSuccess, onError);
        // TODO unregister user with device id:
          // theGCMServer.unregisterUser(userName, registrationId);
      }
    }

    return {
      register: register,
      onNotification: onNotification,
      unregister: unregister
    };
  }]);
