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

  it('should be able to join a community from direct link and see core user and herself as participants', () => {
    browser.get(global.defaultCommunity.url);

    communityPage.join();

    expect(communityPage.getName()).toBe(global.defaultCommunity.name.toUpperCase());

    expect(communityPage.getParticipants()).toContain(loginPage.default.nick);
    expect(communityPage.getParticipants()).toContain(loginPage.participant.nick);


  });

});
