
'use strict';

var random = require('./random'),
    sessionPage = require(__dirname + '/pages/session'),
    MenuPage = require(__dirname + '/pages/menu'),
    loginPage = new sessionPage.Login(),
    registerPage = new sessionPage.Register(),
    forgottenPasswordPage = new sessionPage.ForgottenPassword(),
    recoverPasswordPage = new sessionPage.RecoverPassword(),
    menu = new MenuPage();

xdescribe('Teem', function() {

  describe('login form', function() {
    it('should login existing user', function() {
      loginPage.get();

      loginPage.login();

      expect(registerPage.invalidInputsCount()).toBe(0);

      expect(menu.currentNick()).toBe(loginPage.default.nick);
    });
  });

  describe('register form', function() {
    it('should register new user', function() {
      var nick = random.nick();

      registerPage.get();

      registerPage.register({ nick: nick });

      expect(registerPage.invalidInputsCount()).toBe(0);

      expect(menu.currentNick()).toBe(nick);
    });
  });

  describe('forgotten password form', function() {
    it('should be working on valid input', function() {
      forgottenPasswordPage.get();

      forgottenPasswordPage.recover({ email: random.email()});

      //TODO check it sends the email

    });
  });

  describe('recover password form', function() {
    // It needs a recover password token
    it('should let users to recover their password', function() {
      var password = random.string();

      recoverPasswordPage.get();

      recoverPasswordPage.recover({ password: password });

      /*
      TODO get email confirmation token
      loginPage.get();

      loginPage.login({ password: password });
      */

    });
  });
});
