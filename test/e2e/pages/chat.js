'use strict';

var Chance = require('chance'),
    chance = new Chance();

class ChatPage {

  constructor () {
    this.message = chance.sentence();

    this.inputEl = element(by.model('newMsg'));
    this.sendBtnEl = element(by.css('#chatSendBtn'));
    this.messageTextEls = element.all(by.css('.chat-message-text'));
  }

  get () {
    var url = global.defaultProject.url;

    if (! isDesktop) {
      url += '?tab=chat';
    }

    browser.get(url);

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.inputEl));
  }

  send () {
    this.inputEl.sendKeys(this.message);

    return this.sendBtnEl.click();
  }
}

module.exports = ChatPage;
