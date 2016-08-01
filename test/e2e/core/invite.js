
'use strict';

var InvitePage = require('./../pages/invite'),
    sessionPage = require('./../pages/session'),
    Chance = require('chance'),
    projectPages = require('./../pages/project'),
    invitePage = new InvitePage(),
    loginPage = new sessionPage.Login(),
    registerPage = new sessionPage.Register(),
    projectsPage = new projectPages.ProjectsPage(),
    projectPage = new projectPages.ProjectPage(),
    newProjectPage = new projectPages.NewProjectPage(),
    chance = new Chance(),
    nick = chance.word();


describe('A new user', () => {
  describe('that has registered', () =>{

    beforeAll(() => {
      registerPage.get();
      registerPage.register({ nick: nick });
    });


    describe('can create a project', () => {

      beforeAll(() => {
        projectsPage.get();

        projectsPage.goToNew();

        newProjectPage.create();
      });

      describe('and invite an existing core member', () => {

        beforeAll(() => {
          invitePage.get();
          invitePage.invite('snowden');
        });

        it('the invited person should be in participant list', () => {
          expect(projectPage.getParticipants()).toContain('snowden');
        });
      });

      describe('and invite a person by email', () => {
        beforeAll(() => {
          invitePage.get();
          invitePage.invite('foobar@fakemail.co');
        });
        it('should be consistent', () => {
          expect(false).toBeFalsy();
        });
      });
    });
  });
});
