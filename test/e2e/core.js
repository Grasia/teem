'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Pear2Pear', function() {
  var random = require('./random');

  beforeAll(function() {
    browser.get('index.html');

    browser.driver.executeScript('window.localStorage.clear();');
  });

  describe('1% core user', function() {
    beforeAll(function() {
      browser.get('index.html');
    });

    it('should create a project and share it', function() {
      /*
       * If it is not loaded in 10 seconds, we have a problem in mobiles
       * Please do not increase this
       */
      var timeout = 10000;
      var login = random.emailUser();
      var loginButton = element(by.css('input:enabled[type=submit]'));

      element(by.css('input#login')).sendKeys(login);

      browser.wait(function() {
        return loginButton.click().then(
          function() { return true; },
          function() { return false; }
        );
      }, timeout);

      var communitySearchInput = by.css('.community-search input');

      browser.wait(function() {
        return browser.isElementPresent(communitySearchInput);
      }, timeout);

      element(communitySearchInput).sendKeys('Testing Community');

      var newCommunityButton = by.css('.community-create-btn');

      browser.wait(function() {
        return element(newCommunityButton).isDisplayed();
      }, timeout);

      element(newCommunityButton).click();

      var projectList = by.css('.projects');

      browser.wait(function() {
        return browser.isElementPresent(projectList);
      }, timeout);

      // Wait until pear has loaded the projects
      browser.wait(element(projectList).evaluate('projects.create'), timeout);

      var newProjectButton = by.css('.btn-new-project');

      browser.wait(function() {
        return browser.isElementPresent(newProjectButton);
      }, timeout);

      element(newProjectButton).click();

      var editTitle = by.css('.project-title input');

      browser.wait(function() {
        return browser.isElementPresent(editTitle);
      }, timeout);

      element(editTitle).sendKeys('Testing');

      element(by.css('.swellrt-editor')).click();
      element(by.css('.wave-editor-on')).sendKeys('Grow your community with Pear2Pear');

      element(by.css('a.nav-chat')).click();

      var chatText = 'This is a nice opportunity to discuss about testing';

      element(by.css('.chat-send textarea')).sendKeys(chatText);
      element(by.css('.chat-input-button')).click();

      expect(element.all(by.css('.chat-message-text')).last().getText())
        .toEqual(chatText);

      browser.get('/#/frontpage');

      var comId = browser.driver.executeScript('return window.localStorage.communityId;');

      comId.then(function(communityId){
        expect(browser.getLocationAbsUrl()).toBe('/communities/' + communityId + '/projects');
      });
    });
  });
});
