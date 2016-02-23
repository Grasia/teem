'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:SessionCtrl
 * @description
 * # SessionCtrl
 * Controller of the Teem
 */
angular.module('Teem')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/session/:form', {
        templateUrl: 'session/new.html',
        controller:'SessionCtrl'
      });
    // to recover password: '/sesion/recover_password?token=<theToken>?id=<userId>
  }])
  .controller('SessionCtrl', [
    '$scope', '$location', '$route', 'SessionSvc', '$timeout', 'SharedState', 'SimpleAlertSvc',
    function($scope, $location, $route, SessionSvc, $timeout, SharedState, SimpleAlertSvc) {
    $scope.session = {};

    $scope.user = {
      nick : SessionSvc.users.currentNick()
    };

    $scope.error = {
      current : null
    };

    $scope.$watch('form.current', function() {
      $scope.error.current = null;
    });


    function normalizeFormName(form) {
      var forms = ['login', 'register', 'forgotten_password', 'recover_password', 'migration'];
      var isValid = form && forms.indexOf(form.toLowerCase()) !== -1;
      return isValid? form.toLowerCase() : 'login';
    }

    var inform = function(text, mode){
      SimpleAlertSvc.alert(text, mode || 'info');
      $timeout(function(){
        SharedState.turnOff('shouldLoginSharedState');
      });
    };

    function login() {
      var fields = $scope.current().values;
      var startSession = function() {

        SessionSvc.startSession(
          fields.nick, fields.password,
          function(){
            $timeout(function(){
              SharedState.turnOff('shouldLoginSharedState');
            });
          },
          function(error){
            if (error === 'ACCESS_FORBIDDEN_EXCEPTION') {
              $timeout(function(){
                $scope.error.current = 'wrong_email_or_password';
              });
            }
          }
        );
      };
      startSession();
    }

    function register() {
      var fields = $scope.current().values;

      var onSuccess = function(){
        login();
      };

      var onError = function(e){
        console.log(e);
          if (e === 'ACCOUNT_ALREADY_EXISTS') {
            $timeout(function(){
              $scope.error.current = 'existing_user';
            });
          }
      };

      SessionSvc.registerUser(fields.nick, fields.password, fields.email, onSuccess, onError);
    }

    function forgottenPassword() {

      var fields = $scope.current().values;

      var onSuccess = function(){
        console.log('Success: "Forgotten password" command run on SwellRT');
        inform('session.forgotten_password.success');
      };

      var onError = function(){
        console.log('Error: Something went wrong running "forgotten password" command on SwellRT');
          $timeout(function(){
            $scope.error.current = 'unknown';
          });
      };

      var recoverUrl =  $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#/session/recover_password?token=$token&id=$user-id';

      SessionSvc.forgottenPassword(fields.email, recoverUrl, onSuccess, onError);
    }

    function recoverPassword() {

      var fields = $scope.current().values;

      var params =  $location.search();

      var onSuccess = function(){
        inform('session.' + $scope.form.current + '.success');
      };

      var onError = function(error){
        console.log('Error: Something went wrong running password recovery command on SwellRT', error);
          $timeout(function(){
            if (error === 'ACCESS_FORBIDDEN_EXCEPTION') {
              $scope.error.current = 'authorization';
            } else {
              $scope.error.current = 'unknown';
            }
          });
      };
      if (params.id && params.token) {
        SessionSvc.recoverPassword(params.id, params.token, fields.password, onSuccess, onError);
      } else if (fields.password) {
        SessionSvc.recoverPassword(SessionSvc.users.current(), SessionSvc.users.password, fields.password, onSuccess, onError);
      }
    }

    var migration = function(){

      recoverPassword();

      var fields = $scope.current().values;

      if (fields.email) {

        var successEmail = function() {
          inform('session.set_email.success');
        };

        var errorEmail = function() {
          inform('session.set_email.error', 'alert');
        };

        SessionSvc.updateUserProfile({email: fields.email}, successEmail, errorEmail);
      }


    };

    var sharedState = SharedState.get('shouldLoginSharedState');

    var passwordMustMatch = '(current().values.password && (current().values.password !== current().values.password_repeat)) ? (\'session.password_must_match\' | translate) : ""';

    $scope.form = {
      current: (sharedState !== undefined && sharedState !== true) ? sharedState
        : normalizeFormName($route.current.params.form),
      login: {
        fields: {
          nick: {
            name: 'nick',
            required: true,
            autofocus: true
          },
          password: {
            name: 'password',
            type: 'password',
            required: true
          }
        },
        submit: login
      },
      register: {
        fields: [
          {
            name: 'nick',
            required: true,
            autofocus: true,
            pattern: /^[a-zA-Z0-9\.]+$/
          },
          {
            name: 'password',
            type: 'password',
            required: true,
            pattern: /^.{6,}$/
          },
          {
            name: 'password_repeat',
            type: 'password',
            required: true,
            validation: passwordMustMatch,
          },
          {
            name: 'email',
            type: 'email',
            required: false
          }
        ],
        submit: register
      },
      forgotten_password: {
        fields: [
          {
            name: 'email',
            type: 'email',
            required: true
          }
        ],
        submit: forgottenPassword
      },
      recover_password: {
        fields: [
          {
            name: 'password',
            type: 'password',
            autofocus: true
          },
          {
            name: 'password_repeat',
            type: 'password',
            validation: passwordMustMatch
          }
        ],
        submit: recoverPassword
      },
      migration: {
        fields: [
          {
            name: 'password',
            type: 'password',
            autofocus: true,
            required: true
          },
          {
            name: 'password_repeat',
            type: 'password',
            validation: passwordMustMatch,
            required: true
          },
          {
            name: 'email',
            type: 'email',
            required: true
          }
        ],
        submit: migration
      }
    };

    $scope.current = function() {
      return $scope.form[$scope.form.current];
    };

    $scope.isLoggedIn = function() {
      return SessionSvc.users.loggedIn();
    };

    $scope.logout = function() {
      SessionSvc.stopSession();
    };
  }]);
