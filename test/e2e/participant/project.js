'use strict';

var projectPages = require('./../pages/project'),
    sessionPages = require('./../pages/session'),
    projectPage = new projectPages.ProjectPage(),
    loginPage = new sessionPages.Login();

describe('Participant user', () => {

  beforeAll(() => {
    loginPage.get();
    loginPage.login(loginPage.participant);
  });

  it('should be able to join a project and see the core user and herself as participants', () => {
    browser.get(global.defaultProject.url);

    projectPage.join();

    expect(projectPage.getTitle()).toBe(global.defaultProject.title);

    expect(projectPage.getParticipants()).toContain(loginPage.default.nick);
    expect(projectPage.getParticipants()).toContain(loginPage.participant.nick);
  });
});
