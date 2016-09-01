'use strict';

var communityPages = require('./../pages/community'),
    sessionPages = require('./../pages/session'),
    ProfilePage = require('./../pages/profile'),
    communityPage = new communityPages.CommunityPage(),
    loginPage = new sessionPages.Login(),
    profilePage = new ProfilePage();

describe('Participant user', () => {

  beforeAll(() => {
    loginPage.get();
    loginPage.login(loginPage.participant);
  });

  describe('should be able to join a community from direct link', () => {

    beforeEach(() => {
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

    /* Because of pagination, not all communisties are visible at first, breaking this test.
     * See https://github.com/P2Pvalue/teem/issues/305
     */
    xit(', see the project in her profile, and then leave it', () => {
      profilePage.get(loginPage.participant);

      expect(profilePage.getCommunities()).toContain(global.defaultCommunity.name.toUpperCase());

      profilePage.leaveCommunity(global.defaultCommunity);

      expect(profilePage.getCommunities()).not.toContain(global.defaultCommunity.name.toUpperCase());
    });
  });

});
