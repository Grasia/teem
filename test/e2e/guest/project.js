'use strict';

var projectPages = require('./../pages/project'),
    sessionPages = require('./../pages/session'),
    MenuPage = require('./../pages/menu'),
    projectPage = new projectPages.ProjectPage(),
    loginPage = new sessionPages.Login(),
    menu = new MenuPage();

describe('Guest user', () => {

  beforeAll(() => {
    browser.get('/session/logout');
  });

  it('should be able to see a project with the core user as participant', () => {
    browser.get(global.defaultProject.url);

    browser.wait(protractor.ExpectedConditions.visibilityOf(projectPage.titleEl));

    //expect(menu.isLoggedIn()).toBeFalsy();

    expect(projectPage.getTitle()).toBe(global.defaultProject.title);

    expect(projectPage.getPadText()).toBe(global.defaultProject.padText);

    expect(projectPage.getParticipants()).toContain(loginPage.default.nick);
  });
});
