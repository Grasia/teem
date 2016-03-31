'use strict';

/**
 * @ngdoc function
 * @name Teem.service:NotificationSvc
 * @description
 * # Notification service
 */

angular.module('Teem')
  .factory( 'NotificationSvc', ['$location', 'url', '$timeout', '$rootScope', 'SharedState',
   function($location, url, $timeout, $rootScope, SharedState){

    var push;
    var registrationId;

    var register = function(onSuccess, onFailure) {
      if (window.cordova) {
        push = PushNotification.init(
          { 'android': {'senderID': '843281102628'}});

        push.on('registration', function(data) {
          registrationId = data.registrationId;
          SwellRT.notifications.register(registrationId, onSuccess, onFailure);
        });

        push.on('error', function(e) {
          console.log(e);
        });

        push.on('notification', function(data) {

          // Broadcast notification
          $rootScope.$broadcast('teem.notification.data', data);

          // navigate to notification's workspace if received in background
          if (!data.additionalData.foreground) {

            $location.path('/projects/' + url.urlId(data.additionalData.projId));

            // this navigates to context tab if not already in a project view
            $location.search('tab', data.additionalData.context);
            // this navigates to context tab when already in the project view
            SharedState.set('projectTab', data.additionalData.context);

            $timeout();
          }
        });
      }
    };

    var onNotification = function(callback) {
      if(window.cordova){
        if (push === undefined) {
          console.log('Push notifications have not been initialized');
          return;
        }
        push.on('notification', function(data) {
          callback(data);
        });
      }
    };

    var unregister = function(onSuccess, onError){
      if(window.cordova){
        if (push === undefined) {
          console.log('Push notifications have not been initialized');
          return;
        }
        push.unregister(onSuccess, onError);
      }
    };

    $rootScope.$on('teem.login', function(){
      register(function(){}, function(error){console.log(error);});
    });

    $rootScope.$on('teem.logout', function(){
      unregister(
        function(){}, function(error){console.log(error);});
    });
    return {
      register: register,
      onNotification: onNotification,
      unregister: unregister
    };
  }]);
