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

  logRegexp (regexp, options) {
    if (! options) {
      options = {};
    }

    return browser.wait(() => {
      return this.log().then((text) => {
        if (options.multiline) {
          text = text.replace(/\n/g, ' ');
        }

        var match = text.match(regexp);

        return match && match[1] || null;
      });
    });
  }

  recoveryLink (nick) {
    // This sucks. It is dependent of SwellRT domain configuration.
    var nickWithDomain = nick + '@local.net',
        linkRegexp = new RegExp('(http.*' + this.recoveryPath + '.*id=' + nickWithDomain + ')');

    return this.logRegexp(linkRegexp);

  }

  inviteLink (invitee , inviter, type) {
    var communityRegexp = new RegExp(inviter + '.*' + invitee + '.*"(http.*/' + type + '/.*)"' );

    return this.logRegexp(communityRegexp, { multiline: true });
  }

}

module.exports = SwellRTPage;
