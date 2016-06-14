'use strict';

var SwellRTConfig = {
  swellrtServerDomain: 'local.net'
};

var SwellRT = {
  on:           function() {},
  events:       {
    NETWORK_CONNECTED: 'network-connected'
  },
  createModel:  function() {},
  query:        function() {},
  ready:        function(cb) { cb(); },
  recoverPassword: function() {},
  createUser: function() {},
  setPassword:  function() {},
  startSession: function() {},
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
