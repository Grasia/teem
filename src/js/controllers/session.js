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
      return isValid? form.toLowerCase().replace('_p', 'P') : 'login';
    }

    var inform = function(text, mode){
      //SimpleAlertSvc.alert(text, mode || 'info');
      $timeout(function(){
        SharedState.turnOff('shouldLoginSharedState');
      });
    };

    $scope.submit = function() {
      $scope.submit[$scope.form.current]();
    };

    $scope.submit.login = function() {
      var fields = $scope.form.values;
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
    };

    $scope.submit.register = function() {
      var fields = $scope.form.values;

      var onSuccess = function(){
        $scope.submit.login();
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
    };

    $scope.submit.forgottenPassword = function() {

      var fields = $scope.form.values;

      var onSuccess = function(){
        console.log('Success: "Forgotten password" command run on SwellRT');
        inform('session.forgottenPassword.success');
      };

      var onError = function(){
        console.log('Error: Something went wrong running "forgotten password" command on SwellRT');
          $timeout(function(){
            $scope.error.current = 'unknown';
          });
      };

      var recoverUrl =  $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#/session/recover_password?token=$token&id=$user-id';

      SessionSvc.forgottenPassword(fields.email, recoverUrl, onSuccess, onError);
    };

    $scope.submit.recoverPassword = function() {

      var fields = $scope.form.values;

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
    };

    $scope.submit.migration = function() {

      $scope.submit.recoverPassword();

      var fields = $scope.form.values;

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

    $scope.isFieldVisible = function(field) {
      return $scope.form[$scope.form.current].indexOf(field) !== -1;
    };

    var nickPattern = /^[a-zA-Z0-9\.]+$/;
    var passwordPattern = /^.{6,}$/;

    $scope.validation = {
      required: function() {
        return $scope.form.current !== 'login';
      },
      nickPattern: function() {
        return $scope.form.current !== 'login' ? nickPattern : null;
      },
      passwordPattern: function() {
        return $scope.form.current !== 'login' ? passwordPattern : null;
      }
    };

    $scope.form = {
      current: normalizeFormName($route.current.params.form || String(SharedState.get('shouldLoginSharedState'))),
      values: {},
      login: ['nick', 'password'],
      register: ['nick', 'password', 'passwordRepeat', 'email'],
      forgottenPassword: ['email'],
      recoverPassword: ['password', 'passwordRepeat'],
      migration: ['password', 'passwordRepeat', 'email']
    };

    $scope.isLoggedIn = function() {
      return SessionSvc.users.loggedIn();
    };

    $scope.logout = function() {
      SessionSvc.stopSession();
    };
  }]);
