'use strict';

var Chance = require('chance'),
    chance = new Chance();

class InvitePage {

  constructor () {
    this.titleEl = element(by.css('.project-title'));

    this.message = chance.sentence();

    this.modalHeaderTitle = element(by.css('modal-header-title'));

    this.AddPeopleBtn = element(by.css('.invite-button'));

    this.inputInvite = element(by.css('.selectize-input input'));

    this.inviteBtn = element(by.css('[ng-click="inviteUsers()"]'));

    this.inviteOption = element(by.css('.create[data-selectable], .cachedOption[data-selectable]'));

    this.focusedInvite = element(by.css('.selectize-input input:focus'));
  }

  get () {

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.AddPeopleBtn));

    this.AddPeopleBtn.click();
  }

  invite (who) {

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.inputInvite));

    this.inputInvite.click();

    this.inputInvite.sendKeys(who);

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.inviteOption));

    this.inviteOption.click();

    // to blur input in email invite case.
    this.inputInvite.sendKeys(protractor.Key.TAB);

    this.inviteBtn.click();
  }
}

module.exports = InvitePage;
