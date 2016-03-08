'use strict';

angular.module('Teem')
  .factory('SwellRTCommon', [function(){

    var makeModelPublic = function(model){
      model.addParticipant('@' + __session.domain, null,
        function(err) {
          console.log('ERROR: ' + err);
        }
      );
    };

    return {
      makeModelPublic: makeModelPublic
    };
  }]);
