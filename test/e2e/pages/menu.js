'use strict';

class MenuPage {
  constructor () {
    this.userNickBy = by.binding('user.nick');

    this.guestBy = by.css('.menu-session-nick');

    // Mobile menu element
    this.menuBtnEl = element(by.css('.nav-left .btn'));

    // Desktop session menu element
    this.sessionBy = by.css('.menu-session');

    this.logoutBy = by.css('[ng-click="logout()"]');
  }

  root () {
    var device = isDesktop ? 'desktop' : 'mobile';

    return element(by.css('.menu-' + device));
  }

  currentNick () {
    // Menu is hidden in mobile
    // element.getText does not work with hidden elements
    return this.root().element(this.userNickBy).getInnerHtml();
  }

  ifLoggedIn (ifYes, ifNot) {
    return this.root().element(this.guestBy).getInnerHtml().then((nick) => {
      if (nick !== 'guest') {
        if (ifYes) {
          ifYes();
        }
      } else {
        if (ifNot) {
          ifNot();
        }
      }
    });
  }

  logout () {
    if (isDesktop) {
      this.root().element(this.sessionBy).click();
    } else {
      this.menuBtnEl.click();

      browser.wait(protractor.ExpectedConditions.visibilityOf(this.root().element(this.logoutBy)));
    }

    return this.root().element(this.logoutBy).click();
  }
}

module.exports = MenuPage;
