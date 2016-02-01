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
  }])
  .controller('SessionCtrl', [
    '$scope', '$location', '$route', 'SessionSvc', '$timeout', 'SharedState',
    function($scope, $location, $route, SessionSvc, $timeout, SharedState) {
    $scope.session = {};

    $scope.user = {
      nick : ''
    };

    function validateFormName(form) {
      var forms = ['login', 'register', 'forgotten_password', 'recover_password'];
      var isValid = forms.indexOf(form) !== -1;
      return isValid? form : 'login';
    }

    function login() {
      var fields = $scope.current().values;
      var startSession = function(){
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
      //SessionSvc.registerUser(fields.nick, fields.password, startSession, startSession);
      console.log("login", fields);
    };

    function register() {
      // TODO
      console.log("register", $scope.current().values);
    }

    function forgotten_password() {
      // TODO
      console.log("forgotten", $scope.current().values);
    }

    function recover_password() {
      // TODO
      console.log("recover", $scope.current().values);
    }

    $scope.form = {
      current: validateFormName($route.current.params.form),
      login: {
        fields: {
          nick: {
            name: "nick",
            required: true,
            autofocus: true
          },
          password: {
            name: "password",
            type: "password",
            required: true
          }
        },
        submit: login
      },
      register: {
        fields: [
          {
            name: "nick",
            required: true,
            autofocus: true,
            pattern: /^[a-zA-Z0-9\.]+$/
          },
          {
            name: "password",
            type: "password",
            required: true,
            pattern: /^.{6,}$/
          },
          {
            name: "password_repeat",
            type: "password",
            required: true,
            validation: "current().values.password != current().values.password_repeat ? 'Passwords do not match' : ''"
          },
          {
            name: "email",
            type: "email",
            required: false
          }
        ],
        submit: register
      },
      forgotten_password: {
        fields: [
          {
            name: "email",
            type: "email",
            required: true
          }
        ],
        submit: forgotten_password
      },
      recover_password: {
        fields: [
          {
            name: "password",
            type: "password",
            autofocus: true
          },
          {
            name: "password_repeat",
            type: "password"
          }
        ],
        submit: recover_password
      }
    };

    $scope.current = function() {
      return $scope.form[$scope.form.current];
    };

  }]);
