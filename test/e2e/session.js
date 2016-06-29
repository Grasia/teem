
'use strict';

var random = require('./random'),
    sessionPage = require(__dirname + '/pages/session'),
    loginPage = new sessionPage.Login(),
    forgottenPasswordPage = new sessionPage.ForgottenPassword(),
    recoverPasswordPage = new sessionPage.RecoverPassword();

describe('Teem', function() {

  beforeAll(function() {
    // FIXME: This script doesn't logout completely any more.
    browser.driver.executeScript('window.localStorage.clear();');
    browser.get('index.html');
  });

  describe('login form', function() {
    // FIXME
    xit('should be working on valid input', function() {
      $('.community-new-btn').click();
      $('#nick').sendKeys('mrsmith');
      $('#password').sendKeys('password');
      $('.session-form input[type=submit]').click();
      expect(browser.getCurrentUrl()).toEqual('/projects');
    });
  });

  describe('register form', function() {
    // FIXME
    xit('should be working on valid input', function() {
      $('.community-new-btn').click().then(function() {
        $('.session-register-form-btn').click();
        $('#nick').sendKeys('mrsmith');
        $('#password').sendKeys('password');
        $('#passwordRepeat').sendKeys('password');
        $('#email').sendKeys('mrsmith@local');
        $('.session-form input[type=submit]').click();
        expect($('.error-tip').getAttribute('class')).toMatch('ng-hide');
      });
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
