'use strict';

var gulpConfig = require(__dirname + '/../gulpfile').config;

var sessionPages = require(__dirname + '/e2e/pages/session'),
    communityPages = require(__dirname + '/e2e/pages/community'),
    projectPages = require(__dirname + '/e2e/pages/project');

exports.config = {
  allScriptsTimeout: 30000,

  // Sometimes Selenium Webdriver gets stuck, and directly connecting to browsers work
  //directConnect: true,

  specs: [
    'e2e/**/*.js'
  ],

  multiCapabilities: [
    {
      'browserName': 'chrome',
      'chromeOptions' : {
        args: [
          '--lang=en',
          '--window-size=1024,800'
        ]
      },
    },
    {
      'browserName': 'chrome',
      'chromeOptions' : {
        args: [
          '--lang=en',
          '--window-size=350,650'
        ]
      },
    }
  ],

  baseUrl: 'http://' + gulpConfig.serverTest.host + ':' + gulpConfig.serverTest.port + '/',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    // Our continous delivery server is reaaaalyyy slooooow
    defaultTimeoutInterval: 300000
  },

  suites: {
    session: 'e2e/session.js',
    frontpage: 'e2e/frontpage.js',
    core: 'e2e/core/*.js',
    participant: 'e2e/participant/*.js',
    guest: 'e2e/guest/*.js',
    invite: 'e2e/core/invite.js'
  },

  onPrepare: function() {
    var registerPage = new sessionPages.Register(),
        loginPage = new sessionPages.Login(),
        newCommunityPage = new communityPages.NewCommunityPage(),
        projectsPage = new projectPages.ProjectsPage(),
        newProjectPage = new projectPages.NewProjectPage();

    // Disable animations to improve tests performance
    // Source http://stackoverflow.com/a/32611061/4928558

    var disableNgAnimate = function() {
        angular
            .module('disableNgAnimate', [])
            .run(['$animate', function($animate) {
                $animate.enabled(false);
            }]);
    };

    var disableCssAnimate = function() {
        angular
            .module('disableCssAnimate', [])
            .run(function() {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = '* {' +
                    '-webkit-transition: none !important;' +
                    '-moz-transition: none !important' +
                    '-o-transition: none !important' +
                    '-ms-transition: none !important' +
                    'transition: none !important' +
                    '}';
                document.getElementsByTagName('head')[0].appendChild(style);
            });
    };

    // Decrease Notifications delay
    var shortNotifications = function(){
      angular.module('shortNotifications', ['ui-notification'])
        .config(function(NotificationProvider) {
          NotificationProvider.setOptions({
            delay: 1000
        });
    });
    };

    browser.addMockModule('disableNgAnimate', disableNgAnimate);
    browser.addMockModule('disableCssAnimate', disableCssAnimate);
    browser.addMockModule('shortNotifications', shortNotifications);

    return browser.driver.executeScript('return window.innerWidth >= 992;').then((desktop) => {
      global.isDesktop = desktop;
    }).then(() => {
      // isDesktop global variable is needed for some of these:

      // Register default user
      registerPage.get();
      registerPage.register();

      registerPage.get();
      registerPage.register(registerPage.participant);

      loginPage.get();
      loginPage.login(loginPage.default);

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
