'use strict';

var projectPages = require('./../pages/project'),
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

      expect(projectPage.getParticipants()).toContain(loginPage.default.nick);
    });
  });
});
