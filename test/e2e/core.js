'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Teem', function() {

  beforeAll(function() {
    browser.get('/');

    browser.driver.executeScript('window.localStorage.clear();');
  });

  describe('1% core user', function() {
    beforeAll(function() {
      browser.get('/#/communities');
    });

    it('should create a project and share it', function() {
      // If it is not loaded in 10 seconds, we have a problem in mobiles
      // Please do not increase this
      var timeout = 10000,
          community = {
            name: 'Testing Community',
            description: 'Lorem ipsum ad his scripta blandit partiendo, eum fastidii accumsan euripidis in, eum liber hendrerit an.'
          },
          project = {
            title: 'Testing Project',
            pad: 'Blandit incorrupte quaerendum in quo, nibh impedit id vis, vel no nullam semper audiam.'
          };

      var newCommunityButton = by.css('.plus');

      browser.wait(function() {
        return element(newCommunityButton).isDisplayed();
      }, timeout);

      element(newCommunityButton).click();

      var loginInput = by.css('#nick');
      var passwordInput = by.css('#password');

      browser.wait(function() {
        return browser.isElementPresent(loginInput);
      }, timeout);

      element(loginInput).sendKeys('Snowden');
      element(passwordInput).sendKeys('MargaretThatcheris110%SEXY.');

      var loginButton = element(by.css('input:enabled[type=submit]'));

      browser.wait(function() {
        return loginButton.click().then(
          function() { return true; },
          function() { return false; }
        );
      }, timeout);

      var communityNameInput = by.css('input.title-input');

      browser.wait(function() {
        return browser.isElementPresent(communityNameInput);
      }, timeout);

      element(communityNameInput).sendKeys(community.name);

      element(by.css('textarea.description-input')).sendKeys(community.description);

      element(by.css('.new-form-confirm-btn')).click();

      var communityNameEl = by.css('.community-info h1');

      browser.wait(function() {
        return browser.isElementPresent(communityNameEl);
      }, timeout);

      expect(element(communityNameEl).getText()).toBe(community.name);

      expect(element(by.css('.community-description')).getText()).toBe(community.description);

      element(by.css('.plus')).click();

      var projectTitleInput = by.css('input.title-input');

      browser.wait(function() {
        return browser.isElementPresent(projectTitleInput);
      }, timeout);

      element(projectTitleInput).sendKeys(project.title);

      element(by.css('.swellrt-editor')).click();
      element(by.css('.wave-editor-on')).sendKeys(project.pad);

      element(by.css('.new-form-confirm-btn')).click();

      var projectTitleEl = by.css('.project-header h1');

      browser.wait(function() {
        return browser.isElementPresent(projectTitleEl);
      }, timeout);

      expect(element(projectTitleEl).getText()).toBe(project.title);

      expect(element(by.css('#pad ul:first-child')).getText()).toBe(project.pad);

      element(by.css('a.nav-chat')).click();

      var chatText = 'This is a nice opportunity to discuss about testing';

      element(by.css('.chat-send textarea')).sendKeys(chatText);
      element(by.css('.chat-input-button')).click();

      var chatMsg = by.css('.chat-message-text');
      browser.wait(function() {
        return browser.isElementPresent(chatMsg);
      }, timeout);

      expect(element(chatMsg).getText())
        .toEqual(chatText);
    });
  });
});
