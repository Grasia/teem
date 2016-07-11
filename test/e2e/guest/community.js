'use strict';

var communityPages = require('./../pages/community'),
    sessionPages = require('./../pages/session'),
    MenuPage = require('./../pages/menu'),
    communityPage = new communityPages.CommunityPage(),
    loginPage = new sessionPages.Login(),
    menu = new MenuPage();

describe('guest user', () => {

  beforeAll(() => {
    browser.get('/session/logout');
  });

  it('should be able to see a community from direct link with core user as participant', () => {
    browser.get(global.defaultCommunity.url);

    //expect(menu.isLoggedIn()).toBeFalsy();

    expect(communityPage.getName()).toBe(global.defaultCommunity.name.toUpperCase());

    expect(communityPage.getDescription()).toBe(global.defaultCommunity.description);

    expect(communityPage.getParticipants()).toContain(loginPage.default.nick);
  });

});
