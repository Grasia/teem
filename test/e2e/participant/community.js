'use strict';

var communityPages = require('./../pages/community'),
    sessionPages = require('./../pages/session'),
    communityPage = new communityPages.CommunityPage(),
    loginPage = new sessionPages.Login();

describe('Participant user', () => {

  beforeAll(() => {
    loginPage.get();
    loginPage.login(loginPage.participant);
  });

  describe('should be able to join a community from direct link', () => {

    beforeAll(() => {
      browser.get(global.defaultCommunity.url);
      communityPage.join();
    });

    it(', see the core user and herself as participants, and then leave it', () => {

      expect(communityPage.getParticipants()).toContain(loginPage.default.nick);
      expect(communityPage.getParticipants()).toContain(loginPage.participant.nick);

      communityPage.leave();

      expect(communityPage.getParticipants()).toContain(loginPage.default.nick);
      expect(communityPage.getParticipants()).not.toContain(loginPage.participant.nick);
    });

  });

});
