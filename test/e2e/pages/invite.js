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

    this.inviteOption = element(by.css('[data-selectable]'));

    this.invitePlus = element(by.model('invite.selected')).element(by.css('.plus-circle'));

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

    // There is a race condition when showing users in the selectize option
    // menu, so we have to retry until the menu disappears
    browser.wait(() => {
      return this.inviteOption.click().then(
        () => { return true; },
        () => { return false; }
      );
    });

    // There is a race condition when showing users in the selectize option
    // menu, so we have to retry until the menu disappears
    browser.wait(() => {
      // to blur input in email invite case.
      this.invitePlus.click();

      return this.inviteBtn.click().then(
        () => { return true; },
        () => { return false; }
      );
    });
  }
}

module.exports = InvitePage;
