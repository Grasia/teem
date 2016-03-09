
'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

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
      expect(browser.getCurrentUrl()).toEqual('/#/projects');
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
    // FIXME
    xit('should be working on valid input', function() {
      $('.community-new-btn').click().then(function() {
        $('.session-register-form-btn').click();
        $('#email').sendKeys('mrsmith@local');
        $('.session-form input[type=submit]').click();
        expect($('.error-tip').getAttribute('class')).toMatch('ng-hide');
      });
    });
  });

  describe('recover password form', function() {
    it('should be working on valid input', function() {
      browser.get('/#/session/recover_password');
      $('#password').sendKeys('password');
      $('#passwordRepeat').sendKeys('password');
      $('.session-form input[type=submit]').click();
      // TODO
    });
  });
});
