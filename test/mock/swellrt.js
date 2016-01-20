'use strict';

var SwellRTConfig = {
  swellrtServerDomain: 'local.net'
};

var SwellRT = {
  on: function() {},
  events: {},
  createModel: function() {},
  query: function() {}
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
