'use strict';

var Chance = require('chance'),
    chance = new Chance();

class NeedPage {

  constructor () {
    this.text = chance.sentence();

    this.addNeedEl = element(by.css('.need-item-completed-add'));
    this.addTextEl = this.addNeedEl.element(by.model('need.text'));
    this.addCheckEl = element(by.css('.need-checkbox-add'));

    this.notCompletedNeedEls = element.all(by.css('.need-item-completed-false'));
    this.firstNotCompletedNeedInputEl = element(by.css('.need-item-completed-false .checkbox input'));
  }

  get () {
    var url = global.defaultProject.url;

    if (! isDesktop) {
      url += '?tab=needs';
    }

    browser.get(url);

    browser.wait(protractor.ExpectedConditions.visibilityOf(this.addNeedEl));
  }

  create () {
    this.addTextEl.sendKeys(this.text);

    return this.addCheckEl.click();
  }

  notCompletedNeedValues () {
    return this.notCompletedNeedEls.all(by.model('need.text')).getAttribute('value');
  }
}

module.exports = NeedPage;
