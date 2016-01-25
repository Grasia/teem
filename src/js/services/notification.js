'use strict';

/**
 * @ngdoc function
 * @name Teem.service:NotificationSvc
 * @description
 * # Notification service
 */

angular.module('Teem')
  .factory( 'NotificationSvc', ['$location', 'url', '$timeout', function($location, url, $timeout){

    var push;
    var registrationId;

    var register = function() {
      if (window.cordova) {
        push = PushNotification.init(
          { 'android': {'senderID': '843281102628'}});

        push.on('registration', function(data) {
          console.log('Registration:', data);
          registrationId = data.registrationId;

          SwellRT.notifications.register(registrationId);
        });

        push.on('error', function(e) {
          console.log(e);
        });

        push.on('notification', function(data) {

          // navigate to notification's workspace if received in background
          if (!data.additionalData.foreground) {

            // Note: data.additionalData.commId is the first community in which the project is
            $location.path('/communities/' + url.urlId(data.additionalData.commId) + '/projects/' + url.urlId(data.additionalData.projId));
            $timeout();
          }
        });
      }
    };

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
    };

    var unregister = function(onSuccess, onError){
      if(window.cordova){
        if (push === undefined) {
          throw 'Push notifications have not been initialized';
        }
        push.unregister(onSuccess, onError);

        SwellRT.unregister(registrationId);
      }
    };

    return {
      register: register,
      onNotification: onNotification,
      unregister: unregister
    };
  }]);
