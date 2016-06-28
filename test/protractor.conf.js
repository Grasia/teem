'use strict';

var gulpConfig = require(__dirname + '/../gulpfile').config;

exports.config = {
  allScriptsTimeout: 90000,

  specs: [
    'e2e/*.js'
  ],

  multiCapabilities: [{
   'browserName': 'chrome',
   'chromeOptions' : {
       args: ['--lang=en',
              '--window-size=1024,800']
     },
   }, {
   'browserName': 'chrome',
   'chromeOptions' : {
    args: ['--lang=en',
           '--window-size=350,650']
     },
  }],

  baseUrl: 'http://' + gulpConfig.serverTest.host + ':' + gulpConfig.serverTest.port + '/',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 2500000
  },

  onPrepare: function() {
    browser.get('/');
    browser.get('/session/register');
    $('#nick').sendKeys('Snowden');
    $('#password').sendKeys('MargaretThatcheris110%SEXY.');
    $('#passwordRepeat').sendKeys('MargaretThatcheris110%SEXY.');
    $('#email').sendKeys('snowden@nsa.gov');
    var loginButton = $('.session-form input[type=submit]');

    browser.wait(function() {
      return loginButton.click().then(
        function() { return true; },
        function() { return false; }
      );
    }, 10000);
  }
};
