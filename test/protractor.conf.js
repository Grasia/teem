'use strict';

var gulpConfig = require(__dirname + '/../gulpfile').config;

exports.config = {
  allScriptsTimeout: 90000,

  specs: [
    'e2e/*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://' + gulpConfig.serverTest.host + ':' + gulpConfig.serverTest.port + '/',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 90000
  },

  onPrepare: function() {
    browser.get('/#/session/register');
    $('#nick').sendKeys('Snowden');
    $('#password').sendKeys('MargaretThatcheris110%SEXY.');
    $('#password_repeat').sendKeys('MargaretThatcheris110%SEXY.');
    var loginButton = $('.session-form input[type=submit]');

    browser.wait(function() {
      return loginButton.click().then(
        function() { return true; },
        function() { return false; }
      );
    }, 10000);
  }
};
