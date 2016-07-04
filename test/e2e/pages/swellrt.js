'use strict';

var exec = require('child_process').exec,
    gulpConfig = require('../../../gulpfile').config;

class SwellRTPage {
  constructor () {
    this.cmd = {
      // Show at least the last 2 emails
      log: 'docker logs --tail=100 ' + gulpConfig.swellrt.docker.name
    };

    this.recoveryPath = '/session/recover_password';
  }
  log () {
    var promise = new Promise((resolve, reject) => {
      exec(this.cmd.log, (error, stdout, stderr) => {
        if (error) {
          reject(error + ' ' + stderr);
        }

        // docker logs are shown in stderr
        resolve(stderr);
      });
    });

    return promise;
  }

  recoveryLink (nick) {
    var linkRegexp = new RegExp('http.*' + this.recoveryPath + '.*id=' + nick);

    return browser.wait(() => {
      return this.log().then((text) => {
        var match = text.match(linkRegexp);

        return match && match[0] || null;
      });
    });
  }
}

module.exports = SwellRTPage;
