'use strict';

class MenuPage {
  constructor () {
    this.userNick = element(by.binding('user.nick'));
  }

  currentNick () {
    // Menu is hidden in mobile
    // element.getText does not work with hidden elements
    return this.userNick.getInnerHtml();
  }

}

module.exports = MenuPage;
