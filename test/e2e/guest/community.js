'use strict';

var communityPages = require('./../pages/community'),
    sessionPages = require('./../pages/session'),
    communityPage = new communityPages.CommunityPage(),
    loginPage = new sessionPages.Login(),
    logoutPage = new sessionPages.Logout();

describe('guest user', () => {

  beforeAll(() => {
    logoutPage.get();
  });

  it('should be able to see a community from direct link with core user as participant', () => {
    browser.get(global.defaultCommunity.url);

    browser.wait(protractor.ExpectedConditions.visibilityOf(communityPage.nameEl));

    expect(communityPage.getName()).toBe(global.defaultCommunity.name.toUpperCase());

    expect(communityPage.getDescription()).toBe(global.defaultCommunity.description);

    expect(communityPage.getParticipants()).toContain(loginPage.default.nick);
  });

});
