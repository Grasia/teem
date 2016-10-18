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
    '$scope', 'SharedState', '$route', '$location',
    function($scope, SharedState, $route, $location) {

      function normalizeFormName(form) {
        var forms = ['login', 'register', 'forgotten_password', 'recover_password', 'migration'];
        var isValid = form && forms.indexOf(form.toLowerCase()) !== -1;

        return isValid ? form.toLowerCase().replace('_p', 'P') : 'login';
      }

      $scope.$on('$routeChangeSuccess', function() {
        SharedState.set('modal.session', {
          name: 'session',
          type: normalizeFormName($route.current.params.form),
          search: $location.search()
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
    '$scope', '$location', '$route', 'SessionSvc', '$timeout', 'SharedState', 'Notification',
    function($scope, $location, $route, SessionSvc, $timeout, SharedState, Notification) {

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
            Notification.success({message: 'session.login.success', scope: notificationScope});
            $timeout(function(){
              SharedState.turnOff('modal.session');
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
        Notification.success('session.forgottenPassword.success');
        $timeout(function(){
          SharedState.turnOff('modal.session');
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

      var params =  $scope.search;
      fields.nick = params.id;

      var onSuccess = function(){
        delete localStorage.userId;
        Notification.success('session.' + $scope.form.current + '.success');
        $timeout(function(){
          SharedState.turnOff('modal.session');
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
          SharedState.turnOff('modal.session');
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
            Notification.error('session.set_email.error');
            $timeout(function(){
              SharedState.turnOff('modal.session');
            });
            return;
          }

          Notification.success('session.set_email.success');
          $timeout(function(){
            SharedState.turnOff('modal.session');
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
      current: 'register',
      values: {},
      login: ['nick', 'password'],
      register: ['nick', 'password', 'passwordRepeat', 'email', 'terms'],
      forgottenPassword: ['email'],
      recoverPassword: ['password', 'passwordRepeat'],
      migration: ['password', 'passwordRepeat', 'email']
    };

    // Use modal.session SharedState.type to store form ('login', 'register', etc..)
    // and modal.session SharedState.message to store form message (new_community) (you have to register to create a community)
    // So SharedState can be {name: 'session', type: 'register', message: 'new_community'}
    $scope.$on('mobile-angular-ui.state.changed.modal.session', function(e, newValue) {
      $scope.form.current = newValue.type || 'register';
      $scope.form.message = newValue.message;
      $scope.search = newValue.search;
    });

    $scope.logout = function() {
      SessionSvc.stopSession();
      $location.path('/');
    };
  }]);
