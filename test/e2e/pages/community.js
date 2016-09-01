'use strict';

var Chance = require('chance'),
    chance = new Chance();

class CommunitiesPage {

  constructor () {
  }

  get () {
    browser.get('/communities');
  }

  getPlusEl () {
    var platform = global.isDesktop ? 'desktop' : 'mobile';
    return element(by.css('.plus-' + platform + ' button'));
  }

  goToNew () {
    var newEl = this.getPlusEl();
    browser.wait(protractor.ExpectedConditions.elementToBeClickable(newEl));
    newEl.click();
  }
}

class CommunityPage {

  constructor () {
    this.nameEl = element(by.css('.community-info h1'));

    this.descriptionEl = element(by.binding('community.description'));

    this.participantListEl = element(by.css('[avatars="community._participants"]'));
  }

  getJoinEl () {
    var platform = global.isDesktop ? '.hidden-mobile' : '.hidden-desktop';
    return element(by.css(platform + ' button[participate]'));
  }

  getMenuEl () {
    var platform = global.isDesktop ? '.menu-desktop' : '.nav-right';
    return element(by.css(platform + ' [ui-turn-on="dropdownProjectMenu"]'));
  }

  getLeaveEl() {
    var platform = global.isDesktop ? '.menu-desktop' : '.nav-right';
    return element(by.css(platform + ' [participate-copy-off="community.menu.join"]'));
  }

  join () {
    var joinEl = this.getJoinEl();
    browser.wait(protractor.ExpectedConditions.visibilityOf(joinEl));

    joinEl.click();
  }

  leave () {
    this.getMenuEl().click();
    this.getLeaveEl().click();
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

    this.submitEl =  () => element(by.css('.new-form-confirm-btn'));
  }

  get () {
    browser.get('/communities/new');

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.nameInputEl));
  }

  create () {
    browser.wait(protractor.ExpectedConditions.visibilityOf(this.nameInputEl));

    this.nameInputEl.sendKeys(this.name);

    this.descriptionInputEl.sendKeys(this.description);

    this.submitEl().click();
  }
}

module.exports = {
  CommunitiesPage,
  CommunityPage,
  NewCommunityPage
};
