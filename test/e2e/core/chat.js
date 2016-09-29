
'use strict';

var ChatPage = require('./../pages/chat'),
    sessionPages = require('./../pages/session'),
    chatPage = new ChatPage(),
    loginPage = new sessionPages.Login();

describe('1% core user', () => {

  describe('when authenticated', () => {
    beforeAll(() => {
      loginPage.get();

      loginPage.login();
    });

    // Waiting for the chat to be restored
    xit('should be able to send a new message', () => {
      chatPage.get();

      chatPage.send();

      expect(chatPage.messageTextEls.getText()).toContain(chatPage.message);
    });
  });
});
