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

  // Create user and wave before tests
  onPrepare: function() {
    browser.driver.get(gulpConfig.swellrt.server + '/auth/register');

    browser.driver.findElement(by.id('address')).sendKeys(gulpConfig.swellrt.user);
    browser.driver.findElement(by.id('password')).sendKeys(gulpConfig.swellrt.pass);
    browser.driver.findElement(by.id('verifypass')).sendKeys(gulpConfig.swellrt.pass);
    browser.driver.findElement(by.css('input[value="Register"]')).click();
  }
};
