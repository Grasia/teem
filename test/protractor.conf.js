exports.config = {
  allScriptsTimeout: 90000,

  specs: [
    'e2e/*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:9001/',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 90000
  }
};
