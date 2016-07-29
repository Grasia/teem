'use strict';

class ProfilePage {
  constructor () {

  }

  get (user) {
    browser.get('/user/' + user.id);
  }

  getComunities () {
    // TODO
  }

  getProjects () {
    // TODO
  }
}

module.exports = ProfilePage;
