
'use strict';

var NeedPage = require('./../pages/need'),
    sessionPages = require('./../pages/session'),
    needPage = new NeedPage(),
    loginPage = new sessionPages.Login();

describe('1% core user', () => {

  describe('when authenticated', () => {
    beforeAll(() => {
      loginPage.get();

      loginPage.login();
    });

    describe('in needs page', () => {

      beforeAll(() => {
        needPage.get();
      });

      it('should be able to create a new need', () => {

        needPage.notCompletedNeedEls.count().then((count) => {

          needPage.create();

          expect(needPage.notCompletedNeedEls.count()).toBe(count + 1);

          expect(needPage.notCompletedNeedValues()).toContain(needPage.text);

          // TODO check specific element
          expect(needPage.firstNotCompletedNeedInputEl.getAttribute('checked')).toBeFalsy();
        });
      });

      it('should focus the add need field when clicking add check', () => {

        needPage.addCheckEl.click();

        expect(needPage.addTextEl.getId()).toEqual(browser.driver.switchTo().activeElement().getId());
      });
    });
  });
});
