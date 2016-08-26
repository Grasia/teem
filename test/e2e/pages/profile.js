'use strict';

class ProfilePage {
  constructor () {
    this.communitiesTableEl = element(by.css('.profile-list table.communities'));
    this.projectsTableEl = element(by.css('.profile-list table.projects'));
  }

  get (user) {
    browser.get('/users/' + user.nick + '@local.net');
  }

  getCommunities () {
    browser.wait(protractor.ExpectedConditions.presenceOf(this.communitiesTableEl));
    return this.communitiesTableEl.all(by.css('tr > td:nth-child(2) span')).getText();
  }

  getProjects () {
    browser.wait(protractor.ExpectedConditions.presenceOf(this.projectsTableEl));
    return this.projectsTableEl.all(by.css('tr > td:nth-child(2) span')).getText();
  }

  leaveCommunity (community) {
    return this.getCommunities().then((communities) => {
      let i = communities.indexOf(community.name.toUpperCase()) + 1;
      let el = element(by.css('.profile-list table.communities tr:nth-child('+i+') td.text-right a'));
      el.click();
      return browser.wait(protractor.ExpectedConditions.stalenessOf(el));
    });
  }

  leaveProject (project) {
    return this.getProjects().then((projects) => {
      let i = projects.indexOf(project.title) + 1;
      let el = element(by.css('.profile-list table.projects tr:nth-child('+i+') td.text-right a'));
      el.click();
      return browser.wait(protractor.ExpectedConditions.stalenessOf(el));
    });
  }
}

module.exports = ProfilePage;
