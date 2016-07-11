'use strict';

var Chance = require('chance'),
    chance = new Chance();

class InvitePage {

  constructor () {

    this.message = chance.sentence();

    this.AddPeopleBtn = element(by.css('.invite-button :not(.modal)'));

    this.inputInvite = element(by.model('.selectize-input'));

    this.inviteBtn = element(by.css('[ng-click="inviteUsers()"]'));

  }

  get () {
    browser.get(global.projectUrl);

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.AddPeopleBtn));

    this.AddPeopleBtn.click();

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.inputInvite));
  }

  send () {

    this.inputInvite.click();

    this.inviteOptions = element.all(by.css('.option'));

    browser.pause();

    browser.wait(protractor.ExpectedConditions.presenceOf(this.inviteOptions));

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.inviteOptions));

    this.inviteOptions.get(0).click();

    return this.sendBtnEl.click();
  }
}

module.exports = InvitePage;
