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
    this.titleEl = element(by.binding('project.title'));

    this.padEl = element(by.model('project.pad'));

    this.joinEl = element(by.css('button[join]'));

    this.participantListEl = element(by.css('[avatars="project._participants"]'));
  }

  fetch (id) {
    browser.get(global.defaultCommunity.url + '/teems/fetch/' + id);
  }

  join () {
    browser.wait(protractor.ExpectedConditions.visibilityOf(this.joinEl));
    this.joinEl.click();
  }

  getMenuEl () {
    var platform = global.isDesktop ? '.menu-desktop' : '.nav-right';
    return element(by.css(platform + ' [ui-turn-on="dropdownProjectMenu"]'));
  }

  getLeaveEl() {
    var platform = global.isDesktop ? '.menu-desktop' : '.nav-right';
    return element(by.css(platform + ' [join-copy-off="project.menu.join"]'));
  }

  leave () {
    this.getMenuEl().click();
    this.getLeaveEl().click();
  }

  getTitle () {
    return this.titleEl.getText();
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

    this.padEl = element(by.css('.wave-editor-on'));
    this.padCheckBtn = element(by.css('.nav-right .pad-check'));
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

    this.padEl.click();

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
