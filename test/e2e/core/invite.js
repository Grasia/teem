
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

    registerPage.get();

    registerPage.register({ nick: nick });

    describe('can create a project', () => {

      projectsPage.get();

      projectsPage.goToNew();

      newProjectPage.create();

      describe('and invite an existing core member', () => {

        invitePage.get();
        var invited = invitePage.invite('snowden');

        it('the invited person should be in participant list', function(){
          expect(projectPage.getParticipants()).toContain('snowden');
        });
      });

      describe('and invite a person by email', () => {
        invitePage.get();
        invitePage.invite('foobar@fakemail.co');
      });
    });
  });
});
