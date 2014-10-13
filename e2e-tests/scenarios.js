'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /session/new when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/session/new");
  });


  describe('session/new', function() {

    beforeEach(function() {
      browser.get('index.html#/session/new');
    });


    it('should render session/new when user navigates to /session/new', function() {
      expect(element.all(by.css('[ng-view] input#login')).first()).toBeDefined();
    });

  });
});
