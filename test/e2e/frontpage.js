
'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Pear2Pear', function() {

  beforeAll(function() {
    browser.driver.executeScript("window.localStorage.clear();");

    browser.get('index.html');

  });

  describe('frontpage', function() {

    describe('redirect', function() {

      beforeAll(function() {
        browser.get('index.html');
      });

      it('should automatically redirect to /frontpage when location hash/fragment is empty', function() {
        expect(browser.getLocationAbsUrl()).toMatch('/frontpage');
      });

      it('should render session/form when user navigates to /frontpage', function() {
        expect(element.all(by.css('[ng-view] input#login')).first()).toBeDefined();
      });
    });
  });
});
