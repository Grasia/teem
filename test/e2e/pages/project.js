'use strict';

var Chance = require('chance'),
    chance = new Chance();

class ProjectsPage {

  constructor () {
    this.newEl = element(by.css('[ng-click="create()"]'));
  }

  get () {
    browser.get(communityUrl);
  }

  goToNew () {
    browser.wait(protractor.ExpectedConditions.visibilityOf(this.newEl));

    this.newEl.click();
  }
}

class ProjectPage {

  constructor () {
    this.titleEl = element(by.css('.project-title'));

    this.padEl = element(by.model('project.pad'));

    this.participantListEl = element(by.css('[avatars="project._participants"]'));
  }

  getTitle () {
    return this.titleEl.getText();
  }

  getPadText () {
    return this.padEl.getText();
  }

  getParticipants () {
    return this.participantListEl.all(by.css('img')).getAttribute('title');
  }
}

class NewProjectPage {

  constructor () {
    this.title = chance.sentence({ words: 5 });

    // Remove trailing period
    this.title = this.title.substring(0, this.title.length - 1);

    this.padText = chance.paragraph();

    this.titleInputEl = element(by.model('project.title'));

    this.padEl = element(by.css('.wave-editor-on'));
    this.padCheckBtn = element(by.css('.nav-right .pad-check'));

    this.submitEl =  element(by.css('.new-form-confirm-btn'));
  }

  create () {
    browser.wait(protractor.ExpectedConditions.visibilityOf(this.titleInputEl));

    this.titleInputEl.sendKeys(this.title);

    this.padEl.click();

    this.padEl.sendKeys(this.padText);

    if (! isDesktop) {
      this.padCheckBtn.click();

      return this.submitEl.click();
    }

  }
}

module.exports = {
  ProjectsPage,
  ProjectPage,
  NewProjectPage
};
