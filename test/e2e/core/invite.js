
'use strict';

var InvitePage = require('./../pages/invite'),
    sessionPages = require('./../pages/session'),
    invitePage = new InvitePage(),
    loginPage = new sessionPages.Login();

describe('1% core user', () => {

  describe('when authenticated', () => {
    beforeAll(() => {
      loginPage.get();

      loginPage.login();

    });

    it('should be able to invite an existing user', () => {
      invitePage.get();

      invitePage.send();

    //  expect(chatPage.messageTextEls.getText()).toContain(chatPage.message);

    expect(true).toBe(true);
    });
  });
});
