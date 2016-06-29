'use strict';

class Session {

  constructor () {
    this.default = {
      nick: 'Snowden',
      password: 'MargaretThatcheris110%SEXY.',
      passwordRepeat: 'MargaretThatcheris110%SEXY.',
      email: 'snowden@nsa.gov'
    };

    this.nickInput = element(by.model('form.values.nick'));
    this.passwordInput = element(by.model('form.values.password'));
    this.passwordRepeatInput = element(by.model('form.values.passwordRepeat'));
    this.emailInput = element(by.model('form.values.email'));

    this.formButton = element(by.css('.session-form input[type=submit]'));
  }

  setNick (nick) {
    // This should use ES6 default parameters,
    // but it is not supported in current node version
    if (nick === undefined) {
      nick = this.default.nick;
    }

    this.nickInput.sendKeys(nick);
  }

  setPassword (password) {
    if (password === undefined) {
      password = this.default.password;
    }

    this.passwordInput.sendKeys(password);
  }

  setPasswordRepeat (password) {
    if (password === undefined) {
      password = this.default.passwordRepeat;
    }

    this.passwordRepeatInput.sendKeys(password);
  }

  setEmail (email) {
    if (email === undefined) {
      email = this.default.email;
    }

    this.emailInput.sendKeys(email);
  }

  submit () {
    browser.wait(() => {
      return this.formButton.click().then(
        function() { return true; },
        function() { return false; }
      );
    });
  }
}

class Register extends Session {

  constructor () {
    super();

    this.loginButton = element(by.css('.session-login-form-btn'));
  }

  get () {
    browser.get('/session/register');
  }

  goToLogin () {
    browser.wait(() => {
      return browser.isElementPresent(this.loginButton);
    });

    this.loginButton.click();
  }

  register (options) {
    if (options === undefined) {
      options = {};
    }

    this.setNick(options.nick);
    this.setPassword(options.password);
    this.setPasswordRepeat(options.passwordRepeat);
    this.setEmail(options.email);

    this.submit();
  }
}

class Login extends Session {
  login (options) {
    if (options === undefined) {
      options = {};
    }

    this.setNick(options.nick);
    this.setPassword(options.password);

    this.submit();
  }
}

module.exports = {
  Register,
  Login
};
