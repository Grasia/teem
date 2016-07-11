'use strict';

var projectPages = require('./../pages/project'),
    sessionPages = require('./../pages/session'),
    projectPage = new projectPages.ProjectPage(),
    loginPage = new sessionPages.Login(),
    logoutPage = new sessionPages.Logout();

describe('Guest user', () => {

  beforeAll(() => {
    logoutPage.get();
  });

  it('should be able to see a project with the core user as participant', () => {
    browser.get(global.defaultProject.url);

    browser.wait(protractor.ExpectedConditions.visibilityOf(projectPage.titleEl));

    expect(projectPage.getTitle()).toBe(global.defaultProject.title);

    expect(projectPage.getPadText()).toBe(global.defaultProject.padText);

    expect(projectPage.getParticipants()).toContain(loginPage.default.nick);
  });
});
