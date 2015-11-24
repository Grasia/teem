'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.service:NotificationSvc
 * @description
 * # Notification service
 */

angular.module('Pear2Pear')
  .factory( 'NotificationSvc', [function(){

    var push;

    var register = function(userName) {
      if (window.cordova) {
        push = PushNotification.init(
          { "android": {"senderID": "843281102628"}});

        push.on('registration', function(data) {
          console.log('Registration:', data);
          // TODO register user with device id:
          // theGCMServer.registerUser(userName, data.registrationId);
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
      }
    }

    return {
      register: register,
      onNotification: onNotification,
      unregister: unregister
    };
  }]);
