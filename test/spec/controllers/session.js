'use strict';

describe('SessionCtrl', function() {

  // load the controller's module
  // We need to override the async translateProvider
  // http://angular-translate.github.io/docs/#/guide/22_unit-testing-with-angular-translate
  beforeEach(module('Teem', function ($provide, $translateProvider) {
    $provide.factory('customLoader', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('customLoader');
  }));

  var SessionCtrl,
      SessionSvc,
      $controller,
      $route,
      $rootScope,
      scope,
      $timeout,
      swellRT,
      nick = 'testingnick',
      password = 'testingpassword',
      email = 'testing@local.net',
      token = 'abcde';


  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$controller_, _$route_, _$rootScope_, _$timeout_, _swellRT_, _SessionSvc_) {
    $controller = _$controller_;
    $route = _$route_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    swellRT = _swellRT_;
    SessionSvc = _SessionSvc_;
  }));

  describe('when logging in', function() {
    beforeEach(function() {
      $route.current = {
        params: {
          form: 'login'
        }
      };
    });

    describe('and SwellRT sends the ok', function() {
      var calledNick, calledPassword;

      beforeEach(function() {
        spyOn(SwellRT, 'startSession').
        and.callFake(function(domain, nick, password, success) {
          calledNick = nick;
          calledPassword = password;

          __session.address = nick + '@' + __session.domain;

          success();
        });

        scope = $rootScope.$new();

        SessionCtrl = $controller('SessionCtrl', {
          $route: $route,
          $scope: scope
        });

        scope.form.login.values = {
          nick: nick,
          password: password
        };

        scope.form.login.submit();

        $timeout.flush();
      });

      it('should call SwellRT', function() {
        expect(SwellRT.startSession).
        toHaveBeenCalled();
      });

      it('should pass the right credentials', function() {
        expect(calledNick).toBe(nick);
        expect(calledPassword).toBe(password);
      });

      it('should set current user', function() {
        expect(SessionSvc.users.current()).toBe(nick + '@' + __session.domain);
      });
    });

    describe('and SwellRT sends an error', function() {
      beforeEach(function() {
        spyOn(SwellRT, 'startSession').
        and.callFake(function(domain, nick, password, success, error) {
          error();
        });
      });

      it('should show the error', function() {
        // TODO
      });
    });
  });

  describe('when registering', function() {
    beforeEach(function() {
      $route.current = {
        params: {
          form: 'register'
        }
      };
    });

    describe('and SwellRT sends the ok', function() {
      var sessionNick, sessionPassword,
          registerNick, registerPassword, registerEmail;

      beforeEach(function() {
        spyOn(SwellRT, 'startSession').
        and.callFake(function(domain, nick, password, success) {
          sessionNick = nick;
          sessionPassword = password;

          __session.address = nick + '@' + __session.domain;

          success();
        });

        spyOn(SwellRT, 'createUser').
        and.callFake(function(data, callback) {
          registerNick = data.id;
          registerPassword = data.password;
          registerEmail = data.email;

          callback({data: data});
        });

        // TODO email
        // TODO calling also to sessionStart?

        scope = $rootScope.$new();

        SessionCtrl = $controller('SessionCtrl', {
          $route: $route,
          $scope: scope
        });

        scope.form.register.values = {
          nick: nick,
          password: password,
          password_repeat: password,
          email: email
        };

        scope.form.register.submit();

        $timeout.flush();
      });

      it('should call SwellRT.createUser', function() {
        expect(SwellRT.createUser).
        toHaveBeenCalled();
      });

      it('should call SwellRT.startSession', function() {
        expect(SwellRT.startSession).
        toHaveBeenCalled();
      });

      it('should pass the right credentials', function() {
        expect(registerNick).toBe(nick);
        expect(registerPassword).toBe(password);

        expect(sessionNick).toBe(nick);
        expect(sessionPassword).toBe(password);
      });

      it('should set current user', function() {
        expect(SessionSvc.users.current()).toBe(nick + '@' + __session.domain);
      });
    });

    describe('and SwellRT sends an error', function() {
      beforeEach(function() {
        spyOn(SwellRT, 'createUser').
        and.callFake(function(data, callback) {
          callback({error: 'some error'});
        });
      });

      it('should show the error', function() {
        // TODO
      });
    });
  });

  describe('when forgot password', function() {
    beforeEach(function() {
      $route.current = {
        params: {
          form: 'forgotten_password'
        }
      };
    });

    describe('and SwellRT sends the ok', function() {
      var calledEmail, calledUrl;

      beforeEach(function() {
        spyOn(SwellRT, 'recoverPassword').
        and.callFake(function(email, url, success) {
          calledEmail = email;
          calledUrl = url;

          success();
        });

        scope = $rootScope.$new();

        SessionCtrl = $controller('SessionCtrl', {
          $route: $route,
          $scope: scope
        });

        scope.form.forgotten_password.values = {
          email: email
        };

        scope.form.forgotten_password.submit();

        $timeout.flush();
      });

      it('should call SwellRT', function() {
        expect(SwellRT.recoverPassword).
        toHaveBeenCalled();
      });

      it('should pass the right email', function() {
        expect(calledEmail).toBe(email);
        // TODO: expect(calledUrl).toBe(url);
      });
    });

    describe('and SwellRT sends an error', function() {
      beforeEach(function() {
        spyOn(SwellRT, 'recoverPassword').
        and.callFake(function(email, url, success, error) {
          error();
        });
      });

      it('should show the error', function() {
        // TODO
      });
    });
  });

  describe('when recovering password', function() {
    beforeEach(function() {
      $route.current = {
        params: {
          form: 'recover_password'
        }
      };
    });

    describe('and SwellRT sends the ok', function() {
      var calledToken, calledPassword;

      beforeEach(function() {
        spyOn(SwellRT, 'setPassword').
        and.callFake(function(id, token, password, success) {
          calledToken = token;
          calledPassword = password;

          success();
        });

        scope = $rootScope.$new();

        SessionCtrl = $controller('SessionCtrl', {
          $route: $route,
          $scope: scope
        });

        scope.form.recover_password.values = {
          password: password,
          password_repeat: password
        };

        scope.form.recover_password.submit();

        $timeout.flush();
      });

      it('should call SwellRT', function() {
        expect(SwellRT.setPassword).
        toHaveBeenCalled();
      });

      it('should pass the password', function() {
        expect(calledPassword).toBe(password);
        // TODO: token
      });
    });
  });
});
