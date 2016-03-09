
'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Teem', function() {

  beforeAll(function() {
    browser.driver.executeScript("window.localStorage.clear();");

    browser.get('index.html');

  });

  describe('frontpage', function() {

    describe('redirect', function() {

      beforeAll(function() {
        browser.get('index.html');
      });

      xit('should automatically redirect to /frontpage when location hash/fragment is empty', function() {
        expect(browser.getLocationAbsUrl()).toMatch('/frontpage');
      });
    });
  });
});
