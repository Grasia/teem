'use strict';

var communityPages = require('./../pages/community'),
    sessionPages = require('./../pages/session'),
    newCommunityPage = new communityPages.NewCommunityPage(),
    communityPage = new communityPages.CommunityPage(),
    communitiesPage = new communityPages.CommunitiesPage(),
    loginPage = new sessionPages.Login();

describe('1% core user', () => {

  describe('when authenticated', () => {
    beforeAll(() => {
      loginPage.get();

      loginPage.login();
    });

    it('should be able to create her community from direct link with her as participant', () => {
      newCommunityPage.get();

      newCommunityPage.create();

      expect(communityPage.getName()).toBe(newCommunityPage.name.toUpperCase());

      expect(communityPage.getDescription()).toBe(newCommunityPage.description);

      expect(communityPage.getParticipants()).toContain(loginPage.default.nick);
    });

    it('should be able to create her community from community list with her as participant', () => {
      communitiesPage.get();

      communitiesPage.goToNew();

      newCommunityPage.create();

      expect(communityPage.getName()).toBe(newCommunityPage.name.toUpperCase());

      expect(communityPage.getDescription()).toBe(newCommunityPage.description);

      expect(communityPage.getParticipants()).toContain(loginPage.default.nick);
    });
  });
});
