'use strict';

var Chance = require('chance'),
    chance = new Chance(),
    projectPages = require('./../pages/project'),
    sessionPages = require('./../pages/session'),
    newProjectPage = new projectPages.NewProjectPage(),
    projectPage = new projectPages.ProjectPage(),
    projectsPage = new projectPages.ProjectsPage(),
    loginPage = new sessionPages.Login();

describe('1% core user', () => {

  describe('when authenticated', () => {
    beforeAll(() => {
      loginPage.get();

      loginPage.login();
    });

    it('should be able to create her project with the core user as participant', () => {
      projectsPage.get();

      projectsPage.goToNew();

      newProjectPage.create();

      expect(projectPage.getTitle()).toBe(newProjectPage.title);

      expect(projectPage.getPadText()).toBe(newProjectPage.padText);

      //expect(projectPage.getParticipants()).toContain(loginPage.default.nick);
    });

    it('should create a new project using fetch', () => {
      var localId = chance.word({length: 10});

      projectPage.fetch(localId);

      browser.wait(protractor.ExpectedConditions.visibilityOf(projectPage.titleEl));

      expect(projectPage.titleEl.isDisplayed()).toBe(true);
    });
  });
});
