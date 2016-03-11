// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-10-13 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  var gulpConfig = require(__dirname + '/../gulpfile').config;

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    preprocessors: {
      'src/templates/**/*.html': ['ng-html2js'],
      'src/js/**/!(widgets).js': ['babel'],
      'test/mock/**/*.js': ['babel'],
      'test/spec/**/*.js': ['babel']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/templates/',
      moduleName: 'Teem'
    },

    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        plugins: ['transform-object-assign']
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: gulpConfig.vendor.js.concat([
      'bower_components/angular-mocks/angular-mocks.js',
      'src/js/**/!(widgets).js',
      'src/templates/**/*.html',
      {
        pattern: 'src/l10n/**/*.json',
        included: false
      },
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ]),

    // list of files / patterns to exclude
    exclude: [],

    proxies: {
      '/l10n/': '/base/src/l10n/'
    },

    // web server port
    port: gulpConfig.serverTestKarma.port,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-babel-preprocessor'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
