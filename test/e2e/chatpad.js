'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Pear2Pear', function() {

  browser.get('index.html');

  it('should automatically redirect to /session/new when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch('/session/new');
  });


  describe('session/new', function() {

    beforeEach(function() {
      browser.get('index.html#/session/new');
    });


    it('should render session/new when user navigates to /session/new', function() {
      expect(element.all(by.css('[ng-view] input#login')).first()).toBeDefined();
    });

  });

  describe('chatpad', function() {
    beforeAll(function() {
      browser.get('index.html');
    });

    it('should use the chadpad', function() {
      var timeout = 30000;

      element(by.css('input#login')).sendKeys('Test');
      element(by.css('.login-form button')).click();

      var communityList = by.css('.communities');

      browser.wait(function() {
        return browser.isElementPresent(communityList);
      }, timeout);


      var newCommunityButton = by.css('.new-community a');
      element(newCommunityButton).click();

      var newCommunityName = by.css('.new-community-name');

      browser.wait(function(){
        return browser.isElementPresent(newCommunityName);
      });

      element(newCommunityName).sendKeys('Testing Community');

      element(by.css('.create-community-btn')).click();

      var projectList = by.css('.projects');

      browser.wait(function() {
        return browser.isElementPresent(projectList);
      }, timeout);

      // Wait until pear has loaded the projects
      browser.wait(element(projectList).evaluate('projects.create'), timeout);

      var newProjectButton = by.css('.new-project a');
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

      // Temporary solution for removing a project
      // It should be included inside tests
      browser.executeScript(function() {
        angular.element(document.querySelector('.chat')).scope().destroyProject();
      });

      // Temporary solution for removing a community
      // It should be included inside tests
      browser.executeScript(function() {
        angular.element(document.querySelector('.chat')).scope().destroy();
      });
      // Give time for the former to be exec
      element(by.css('.nav-left a')).click();
    });
  });
});
