'use strict';

var gulpConfig = require(__dirname + '/../gulpfile').config;

var sessionPages = require(__dirname + '/e2e/pages/session'),
    communityPages = require(__dirname + '/e2e/pages/community'),
    projectPages = require(__dirname + '/e2e/pages/project');

exports.config = {
  allScriptsTimeout: 90000,

  // Sometimes Selenium Webdriver gets stuck, and directly connecting to browsers work
  //directConnect: true,

  specs: [
    'e2e/**/*.js'
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
    defaultTimeoutInterval: 90000
  },

  suites: {
    session: 'e2e/session.js',
    frontpage: 'e2e/frontpage.js',
    core: 'e2e/core/*.js',
    guest: 'e2e/guest/*.js'
  },

  onPrepare: function() {
    var registerPage = new sessionPages.Register(),
        loginPage = new sessionPages.Login(),
        newCommunityPage = new communityPages.NewCommunityPage(),
        projectsPage = new projectPages.ProjectsPage(),
        newProjectPage = new projectPages.NewProjectPage();

    return browser.driver.executeScript('return window.innerWidth >= 992;').then((desktop) => {
      global.isDesktop = desktop;
    }).then(() => {
      // isDesktop global variable is needed for some of these:

      // Register default user
      registerPage.get();
      registerPage.register();

      loginPage.get();
      loginPage.login();

      // Create default community
      newCommunityPage.get();
      newCommunityPage.create();

      browser.getCurrentUrl().then((url) => {
        global.defaultCommunity = newCommunityPage;
        global.defaultCommunity.url = url;
      });

      // Create default teem
      projectsPage.goToNew();
      newProjectPage.create();

      return browser.getCurrentUrl().then((url) => {
        global.defaultProject = newProjectPage;
        global.defaultProject.url = url;
      });
    });
  }
};
