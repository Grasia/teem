'use strict';


var SwellRTPage = require(__dirname + '/swellrt'),
    swellrt = new SwellRTPage ();

class Session {

  constructor () {
    this.default = {
      nick: 'snowden',
      password: 'MargaretThatcheris110%SEXY.',
      passwordRepeat: 'MargaretThatcheris110%SEXY.',
      email: 'snowden@nsa.gov'
    };

    this.formElement = element(by.css('.session-form'));

    this.nickInput = element(by.model('form.values.nick'));
    this.passwordInput = element(by.model('form.values.password'));
    this.passwordRepeatInput = element(by.model('form.values.passwordRepeat'));
    this.emailInput = element(by.model('form.values.email'));

    this.invalidInputs = element.all(by.css('.ng-invalid'));
    this.errorAlert = element(by.css('#error_alert'));

    this.formButton = element(by.css('.session-form input[type=submit]'));
  }

  get () {
    return browser.get('/session/' + this.path);
  }

  setNick (nick) {
    // This should use ES6 default parameters,
    // but it is not supported in current node version
    if (nick === undefined) {
      nick = this.default.nick;
    }

    return this.nickInput.sendKeys(nick);
  }

  setPassword (password) {
    if (password === undefined) {
      password = this.default.password;
    }

    return this.passwordInput.sendKeys(password);
  }

  setPasswordRepeat (password) {
    if (password === undefined) {
      password = this.default.passwordRepeat;
    }

    return this.passwordRepeatInput.sendKeys(password);
  }

  setEmail (email) {
    if (email === undefined) {
      email = this.default.email;
    }

    return this.emailInput.sendKeys(email);
  }

  submit () {
    return this.formButton.click();
  }

  expectNoErrors () {
    expect(this.invalidInputs.count()).toBe(0);
    expect(this.errorAlert.isPresent()).toBeFalsy();
  }
}

class Register extends Session {

  constructor () {
    super();

    this.path = 'register';
    this.loginButton = element(by.css('.session-login-form-btn'));
  }

  goToLogin () {
    browser.wait(protractor.ExpectedConditions.visibilityOf(this.loginButton));

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

    return this.submit();
  }
}

class Login extends Session {

  constructor () {
    super();

    this.path = 'login';
  }

  login (options) {
    if (options === undefined) {
      options = {};
    }

    this.setNick(options.nick);
    this.setPassword(options.password);

    return this.submit();
  }
}

class ForgottenPassword extends Session {
  constructor () {
    super();

    this.path = 'forgotten_password';
  }

  recover (options) {
    if (options === undefined) {
      options = {};
    }

    this.setEmail(options.email);

    return this.submit();
  }
}

class RecoverPassword extends Session {
  constructor () {
    super();

    this.path = 'recover_password';
  }

  get (nick) {
    return new Promise((resolve) => {
      swellrt.recoveryLink(nick).then((url) => {
        browser.get(url).then(() => {
          resolve();
        });
      });
    });
  }

  recover (options) {
    if (options === undefined) {
      options = {};
    }

    this.setPassword(options.password);
    this.setPasswordRepeat(options.password);

    return this.submit();
  }
}

module.exports = {
  Register,
  Login,
  ForgottenPassword,
  RecoverPassword
};
