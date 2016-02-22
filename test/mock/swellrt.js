'use strict';

var SwellRTConfig = {
  swellrtServerDomain: 'local.net'
};

var SwellRT = {
  on:           function() {},
  events:       {},
  createModel:  function() {},
  query:        function() {},
  recoverPassword: function() {},
  createUser: function() {},
  setPassword:  function() {},
  startSession: function() {},
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
