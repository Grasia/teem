
'use strict';

var sessionPage = require('./pages/session'),
    loginPage = new sessionPage.Login(),
    logoutPage = new sessionPage.Logout();

describe('Teem', function() {

  describe('frontpage', function() {

    describe('when not logged in', function() {
      beforeAll(() => {
        logoutPage.get();
      });

      it('should automatically redirect to /teems/featured', function() {
        browser.get('/');

        // There is a instantion fo a controller in the '/' route,
        // so the browser promise returns before the redirect is performed
        browser.wait(() => {
          return browser.getLocationAbsUrl().then((url) => {
            return url !== '/';
          });
        });

        expect(browser.getLocationAbsUrl()).toMatch('/teems/featured');
      });
    });

    describe('when logged in', function() {
      beforeAll(() => {
        loginPage.get();
        loginPage.login();
      });

      it('should automatically redirect to /home/teems', function() {


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
