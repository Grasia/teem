
'use strict';

var sessionPage = require('./pages/session'),
    MenuPage = require('./pages/menu'),
    loginPage = new sessionPage.Login(),
    menu = new MenuPage();

describe('Teem', function() {

  describe('frontpage', function() {

    describe('when not logged in', function() {

      it('should automatically redirect to /communities', function() {
        browser.get('/');

        // There is a instantion fo a controller in the '/' route,
        // so the browser promise returns before the redirect is performed
        browser.wait(() => {
          return browser.getLocationAbsUrl().then((url) => {
            return url !== '/';
          });
        });

        menu.ifLoggedIn(() => {
          menu.logout();

          browser.get('/');

          browser.wait(() => {
            return browser.getLocationAbsUrl().then((url) => {
              return url !== '/';
            });
          });
        });

        expect(browser.getLocationAbsUrl()).toMatch('/communities');
      });
    });

    describe('when logged in', function() {
      it('should automatically redirect to /home/teems', function() {
        loginPage.get();

        loginPage.login();

        browser.get('/');

        // There is a instantion fo a controller in the '/' route,
        // so the browser promise returns before the redirect is performed
        browser.wait(() => {
          return browser.getLocationAbsUrl().then((url) => {
            return url !== '/';
          });
        });

        expect(browser.getLocationAbsUrl()).toMatch('/home/teems');
      });
    });
  });
});
