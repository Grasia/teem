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
      // Prioritize before /session/:form
      when('/session/logout', {
        template: '',
        controller: 'SessionLogoutCtrl'
      }).
      when('/session/:form', {
        template: '',
        controller:'SessionRouteCtrl'
      });
    // to recover password: '/sesion/recover_password?token=<theToken>?id=<userId>
  }])
  .controller('SessionRouteCtrl', [
    '$scope', 'SessionSvc', '$route', '$location',
    function($scope, SessionSvc, $route, $location) {

      function normalizeFormName(form) {
        var forms = ['login', 'register', 'forgotten_password', 'recover_password', 'migration'];
        var isValid = form && forms.indexOf(form.toLowerCase()) !== -1;

        return isValid ? form.toLowerCase().replace('_p', 'P') : 'login';
      }

      $scope.$on('$routeChangeSuccess', function() {
        SessionSvc.show({
          form: normalizeFormName($route.current.params.form)
        });

        $location.path('/');
      });
    }
  ])
  .controller('SessionLogoutCtrl',
    function(SessionSvc, $location) {

      SessionSvc.onLoad(function() {
        SessionSvc.stopSession();

        $location.path('/');
      });
    }
  )
  .controller('SessionCtrl', [
    '$scope', '$location', '$route', 'SessionSvc', '$timeout', '$mdDialog', 'NotificationSvc',
    function($scope, $location, $route, SessionSvc, $timeout, $mdDialog, NotificationSvc) {

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

    $scope.goToForm = function(sessionForm, form) {
      sessionForm.$setUntouched();
      $scope.form.current = form;
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
            // TODO: Should we move it to a service?
            var notificationScope = $scope.$new(true);
            notificationScope.values = {nick: fields.nick};
            NotificationSvc.success({message: 'session.login.success', scope: notificationScope});
            $timeout(function(){
              $mdDialog.hide();
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
            $scope.error.current = 'existing_user';
          } else {
            $scope.error.current = 'unknown';
          }

          $timeout();
      };

      SessionSvc.registerUser(fields.nick, fields.password, fields.email, onSuccess, onError);
    };

    $scope.submit.forgottenPassword = function() {

      var fields = $scope.form.values;

      var onSuccess = function(){
        NotificationSvc.success('session.forgottenPassword.success');
        $timeout(function(){
          $mdDialog.hide();
        });
      };

      var onError = function(){
        $timeout(function(){
          $scope.error.current = 'unknown';
        });
      };

      var recoverUrl =  $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/session/recover_password?token=$token&id=$user-id';

      SessionSvc.forgottenPassword(fields.email, recoverUrl, onSuccess, onError);
    };

    $scope.submit.recoverPassword = function() {

      var fields = $scope.form.values;

      var params =  $location.search();

      var onSuccess = function(){
        delete localStorage.userId;
        NotificationSvc.success('session.' + $scope.form.current + '.success');
        $timeout(function(){
          $mdDialog.hide();
          $scope.submit.login();
        });
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

      SessionSvc.recoverPassword(params.id, params.token, fields.password, onSuccess, onError);
    };

    $scope.submit.migration = function() {
      var fields = $scope.form.values;

      var onSuccess = function(){
        delete localStorage.userId;

        Notification.success('session.' + $scope.form.current + '.success');

        $timeout(function(){
          $mdDialog.hide();
        });
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

      SessionSvc.recoverPassword(SessionSvc.users.current(), SessionSvc.users.password, fields.password, onSuccess, onError);

      if (fields.email) {

        var onComplete = function(res) {
          if (res.error) {
            NotificationSvc.error('session.set_email.error');
            $timeout(function(){
              $mdDialog.hide();
            });
            return;
          }

          NotificationSvc.success('session.set_email.success');
          $timeout(function(){
            $mdDialog.hide();
          });
        };

        SessionSvc.updateUserProfile({email: fields.email}, onComplete);
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
      current: this.form || 'register',
      message: this.message,
      values: {},
      login: ['nick', 'password'],
      register: ['nick', 'password', 'passwordRepeat', 'email', 'terms'],
      forgottenPassword: ['email'],
      recoverPassword: ['password', 'passwordRepeat'],
      migration: ['password', 'passwordRepeat', 'email']
    };
  }]);
