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
    '$scope', '$location', '$route', 'SessionSvc', '$timeout', 'SharedState',
    function($scope, $location, $route, SessionSvc, $timeout, SharedState) {
    $scope.session = {};

    $scope.user = {
      nick : ''
    };

    function normalizeFormName(form) {
      var forms = ['login', 'register', 'forgotten_password', 'recover_password'];
      var isValid = form && forms.indexOf(form.toLowerCase()) !== -1;
      return isValid? form.toLowerCase() : 'login';
    }

    function login() {
      var fields = $scope.current().values;
      var startSession = function() {
        // TODO change password when register is available
        SessionSvc.startSession(
          fields.nick, SessionSvc.users.password,
          function(){
            $timeout(function(){
              SharedState.turnOff('shouldLoginSharedState');
            });
          },
          function(error){
            console.log(error);
          }
        );
      };
      console.log('login', fields);
    }

    function register() {
      var fields = $scope.current().values;
      console.log('register', fields);
      //TODO: proper error callback
      SessionSvc.registerUser(fields.nick, fields.password, login(),
                              function(e){console.log(e);});
    }

    function forgottenPassword() {

      var fields = $scope.current().values;
      console.log('forgotten', fields);

      // TODO: proper success and error handling
      var onSuccess = function(){
        console.log('Success: "Forgotten password" command run on SwellRT');
      };

      var onError = function(){
        console.log('Error: Something went wrong running "forgotten password" command on SwellRT');
      };

      var recoverUrl =  $location.protocol + '://' + $location.host + '/session/recover_passworq?token=$token&id=$user-id';

      SessionSvc.forgottenPassword(fields.email, recoverUrl, onSuccess, onError);
    }

    function recoverPassword() {

      var fields = $scope.current().values;
      console.log('recover', fields);

      var params =  $location.search();

      var onSuccess = function(){
        login();
      };

      // TODO: proper error handling
      var onError = function(){
        console.log('Error: Something went wrong running password recovery command on SwellRT');
      };

      SessionSvc.recoverPassword(params.id, params.token, fields.password, onSuccess, onError);
    }

    $scope.form = {
      current: normalizeFormName($route.current.params.form),
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
            validation: 'current().values.password != current().values.password_repeat ? "Passwords do not match" : ""'
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
            validation: 'current().values.password != current().values.password_repeat ? "Passwords do not match" : ""'
          }
        ],
        submit: recoverPassword
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
