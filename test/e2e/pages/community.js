'use strict';

var Chance = require('chance'),
    chance = new Chance();

class CommunitiesPage {

  constructor () {
    this.newEl = element(by.css('[ng-click="create()"]'));
  }

  get () {
    browser.get('/communities');
  }

  goToNew () {
    browser.wait(protractor.ExpectedConditions.elementToBeClickable(this.newEl));

    this.newEl.click();
  }
}

class CommunityPage {

  constructor () {
    this.nameEl = element(by.css('.community-info h1'));

    this.descriptionEl = element(by.binding('community.description'));

    this.participantListEl = element(by.css('[avatars="community._participants"]'));
  }

  getName () {
    return this.nameEl.getText();
  }

  getDescription () {
    return this.descriptionEl.getText();
  }

  getParticipants () {
    return this.participantListEl.all(by.css('img')).getAttribute('title');
  }
}

class NewCommunityPage {

  constructor () {
    this.name = chance.sentence({ words: 3 });

      // Remove trailing period
    this.name = this.name.substring(0, this.name.length - 1);

    this.description = chance.paragraph();

    this.nameInputEl = element(by.model('community.name'));
    this.descriptionInputEl = element(by.model('community.description'));

    this.submitEl =  element(by.css('.new-form-confirm-btn'));
  }

  get () {
    browser.get('/communities/new');

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.nameInputEl));
  }

  create () {
    browser.wait(protractor.ExpectedConditions.visibilityOf(this.nameInputEl));

    this.nameInputEl.sendKeys(this.name);

    this.descriptionInputEl.sendKeys(this.description);

    this.submitEl.click();
  }
}

module.exports = {
  CommunitiesPage,
  CommunityPage,
  NewCommunityPage
};
