'use strict';

var Chance = require('chance'),
    chance = new Chance();

class ProjectsPage {

  constructor () {
  }

  get () {
    browser.get(global.defaultCommunity.url);
  }

  getPlusEl () {
    var platform = global.isDesktop ? 'desktop' : 'mobile';
    return element(by.css('.plus-' + platform + ' button'));
  }

  goToNew () {
    var newEl = this.getPlusEl();
    browser.wait(protractor.ExpectedConditions.visibilityOf(newEl));
    newEl.click();
  }
}

class ProjectPage {

  constructor () {
    this.titleEl = element(by.model('project.title'));

    this.menuEl = element(by.css('.project-' + global.media + ' [ui-turn-on="dropdownProjectMenu"]'));

    this.padEl = element(by.model('project.pad'));

    this.joinEl = element(by.css('button[join]'));

    this.joinEmailEl = element(by.model('message.email'));
    this.joinTextEl = element(by.model('message.text'));
    this.joinSendEl = element(by.css('[ng-click="$ctrl.send()"]'));

    this.joinStartEl = element(by.css('.project-join-success [join]'));

    this.leaveEl = element(by.css('.project-' + global.media + ' [join-copy-off="project.menu.join"]'));

    this.participantListEl = element(by.css('[avatars="project._participants"]'));
  }

  fetch (id) {
    browser.get(global.defaultCommunity.url + '/teems/fetch/' + id);
  }

  join (options) {
    // Default parameter values should be supported in node 6.x
    // join (options = { email: chance.email(), text: chance.sentence() }) {
    if (! options) {
      options = {};
    }

    if (! options.hasOwnProperty('email')) {
      options.email = chance.email();
    }

    if (! options.hasOwnProperty('text')) {
      options.text = chance.sentence();
    }

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.joinEl));
    this.joinEl.click();

    this.joinEmailEl.sendKeys(options.email);

    // Don't touch the field if there is not text
    if (options.text) {
      this.joinTextEl.sendKeys(options.text);
    }

    this.joinSendEl.click();

    this.joinStartEl.click();
  }

  leave () {
    this.menuEl.click();
    this.leaveEl.click();
  }

  getTitle () {
    return this.titleEl.getAttribute('value');
  }

  getPadText () {
    return this.padEl.getText();
  }

  getParticipants () {
    browser.wait(protractor.ExpectedConditions.presenceOf(this.participantListEl));
    return this.participantListEl.all(by.css('img')).getAttribute('title');
  }

  getParticipantsFromModel () {
    return browser.executeScript(function() {
      return angular.element('[project-people]').scope().project._participants.map(participant => participant.split('@')[0]);
    });
  }
}

class NewProjectPage {

  constructor () {
    this.title = chance.sentence({ words: 5 });

    // Remove trailing period
    this.title = this.title.substring(0, this.title.length - 1);

    this.padText = chance.paragraph();

    this.titleInputEl = element(by.model('project.title'));

    this.nextBtn = element(by.css('[ng-click="goToNextForm()"]'));

    this.padEmptyTipCloseBtn = element(by.css('[ng-click="closePadEmptyTip()"]'));

    this.padEl = element(by.css('.wave-editor-on'));
    this.padCheckBtn = element(by.css('.pad-check'));
  }

  create () {
    // Image
    this.nextBtn.click();

    // Title
    this.titleInputEl.sendKeys(this.title);

    this.nextBtn.click();

    // Invite
    this.nextBtn.click();

    // Share
    this.nextBtn.click();

    this.padEmptyTipCloseBtn.click();

    // pad should be focused now
    // this.padEl.click();

    this.padEl.sendKeys(this.padText);

    if (! isDesktop) {
      this.padCheckBtn.click();
    }
  }
}

module.exports = {
  ProjectsPage,
  ProjectPage,
  NewProjectPage
};
