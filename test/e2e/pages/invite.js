'use strict';

var Chance = require('chance'),
    chance = new Chance();

class InvitePage {

  constructor () {
    this.titleEl = element(by.css('.project-title'));

    this.message = chance.sentence();

    this.AddPeopleBtn = element(by.css('.invite-button'));

    this.inviteBtn = element(by.css('[ng-click="inviteUsers()"]'));

  }

  get () {

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.AddPeopleBtn));

    this.AddPeopleBtn.click();
  }

  invite (who) {

    this.inputInvite = element(by.css('.selectize-input input'));

    this.inviteOption = element(by.css('[data-selectable]'));

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.inputInvite));

    this.inputInvite.click();

    this.inputInvite.sendKeys(who);

    browser.wait(protractor.ExpectedConditions.presenceOf(this.inviteOption));

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.inviteOption));


    this.inviteOption.click();

    this.focusedInvite = element(by.css('.selectize-input input:focus'));

    // to blur input in email invite case.
    this.inputInvite.sendKeys(protractor.Key.TAB);

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.inviteBtn));

    return this.inviteBtn.click();
  }
}

module.exports = InvitePage;
