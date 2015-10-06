'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Pear2Pear', function() {
  var random = require('./random');

  beforeAll(function() {
    browser.get('index.html');

    browser.driver.executeScript("window.localStorage.clear();");
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

      element(by.css('input#login')).sendKeys(login);
      element(by.css('input:enabled[type=submit]')).click();

      var communityList = by.css('.communities');

      browser.wait(function() {
        return browser.isElementPresent(communityList);
      }, timeout);


      var communitySearchInput = by.css('.community-search input');
      element(communitySearchInput).sendKeys('Testing Community');

      var newCommunityButton = by.css('.new-community-item button');
      element(newCommunityButton).click();

      var projectList = by.css('.projects');

      browser.wait(function() {
        return browser.isElementPresent(projectList);
      }, timeout);

      // Wait until pear has loaded the projects
      browser.wait(element(projectList).evaluate('projects.create'), timeout);

      var newProjectButton = by.css('.new-project-btn');
      element(newProjectButton).click();

      var editTitle = by.css('.project-title input');

      browser.wait(function() {
        return browser.isElementPresent(editTitle);
      }, timeout);

      element(editTitle).sendKeys('Testing');

      element(by.css('#pad .swellrt-editor')).click();
      element(by.css('#pad .wave-editor-on')).sendKeys('Grow your community with Pear2Pear');

      element(by.css('a.nav-chat')).click();

      var chatText = 'This is a nice opportunity to discuss about testing';

      element(by.css('.chat-send textarea')).sendKeys(chatText);
      element(by.css('.chat-input-button')).click();

      expect(element.all(by.css('.chat-message-text')).last().getText())
        .toEqual(chatText);
    });
  });

  describe('session and community preferences working', function(){

    it('should automatically redirect to the saved community when visiting frontpage', function() {

      browser.get('/#/frontpage');

      var comId = browser.driver.executeScript("return window.localStorage.communityId;");

      comId.then(function(communityId){
        expect(browser.getLocationAbsUrl()).toBe('/communities/' + communityId + '/projects?section=mydoing');
      });
    });
  });
});
