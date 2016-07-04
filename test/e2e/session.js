
'use strict';

var random = require('./random'),
    sessionPage = require('./pages/session'),
    MenuPage = require('./pages/menu'),
    SwellRTPage = require('./pages/swellrt'),
    loginPage = new sessionPage.Login(),
    registerPage = new sessionPage.Register(),
    forgottenPasswordPage = new sessionPage.ForgottenPassword(),
    recoverPasswordPage = new sessionPage.RecoverPassword(),
    menu = new MenuPage(),
    swellrt = new SwellRTPage();

describe('Teem', function() {

  describe('login form', function() {
    it('should login existing user', function() {
      loginPage.get();

      loginPage.login();

      registerPage.expectNoErrors();

      expect(menu.currentNick()).toBe(loginPage.default.nick);
    });
  });

  describe('register form', function() {
    it('should register new user', function() {
      var nick = random.nick();

      registerPage.get();

      registerPage.register({ nick: nick });

      registerPage.expectNoErrors();

      expect(menu.currentNick()).toBe(nick);
    });
  });

  describe('forgotten and recover password form', function() {
    it('should allow a new user to recover her password', function() {
      var nick = random.nick(),
          email = random.email(),
          newPassword = random.string();

      registerPage.get();

      registerPage.register({
        nick: nick,
        email: email
      });

      registerPage.expectNoErrors();

      forgottenPasswordPage.get();

      forgottenPasswordPage.recover({ email: email});

      // In dev mode, there is not SMTP server
      // SwellRT waits for the timeout to respond and then shows and
      // error, so we cannot check this
      // forgottenPasswordPage.expectNoErrors();

      expect(swellrt.recoveryLink(nick)).toMatch('http.*' + swellrt.recoveryPath);

      recoverPasswordPage.get(nick);

      recoverPasswordPage.recover({ password: newPassword });

      recoverPasswordPage.expectNoErrors();

      loginPage.get();

      loginPage.login({
        nick: nick,
        password: newPassword
      });

      // https://github.com/P2Pvalue/swellrt/issues/163
      //expect(menu.currentNick()).toBe(loginPage.default.nick);
    });
  });
});
