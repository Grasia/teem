'use strict';

var callbackMap = {};

function mockedStart(domain, nick, password, success) {

  var sid = Math.random().toString(16).substring(2);

    if (callbackMap[SwellRT.events.NETWORK_CONNECTED] !== undefined){
      callbackMap[SwellRT.events.NETWORK_CONNECTED]();
    }
    success({
      // return a random session id
      sessionid: sid
    });

}

var SwellRT = {
  on: function(eventName, callback){
    callbackMap[eventName] = callback;
  },
  events:       {
    NETWORK_CONNECTED: 'network-connected'
  },
  createModel:  function() {},
  query:        function() {},
  ready:        function(cb) { cb(); },
  recoverPassword: function() {},
  createUser: function() {},
  setPassword:  function() {},
  startSession: mockedStart,
  resumeSession: function(cb){
    mockedStart(undefined, undefined, undefined, cb);
  },
  stopSession:  function() {},
  user: {
    ANONYMOUS: '_anonymous_'
  }
};

var __session = {
  domain: 'local.net'
};

function SwellRTModel() {
  return {
    root: {
      type: function() { return 'MapType'; },
      keySet: function() { return []; },
      registerEventHandler: function() {}
    },
    addParticipant: function() {},
    createList:     function() {},
    createMap:      function() {},
    createString:   function() {},
    createText:     function() {}
  };
}
