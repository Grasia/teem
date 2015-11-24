'use strict';

angular.module('Pear2Pear')
  .factory('ProfilesSvc', ['swellRT', '$q', '$timeout', 'SessionSvc', function(swellRT, $q, $timeout, SessionSvc){

    var Profile = function(){
    };

    Profile.prototype.timestampPadAccess = function(projId){
      if (!this.lastPadVisit) this.lastPadVisit = {};
      this.lastPadVisit[projId] = (new Date()).toJSON();
    };

    Profile.prototype.timestampChatAccess = function(projId){
      if (!this.lastChatVisit) this.lastChatVisit = {};
      this.lastChatVisit[projId] = (new Date()).toJSON();
    };

    Profile.prototype.timestampNeedsAccess = function(projId){
      if (!this.lastNeedsVisit) this.lastNeedsVisit = {};
      this.lastNeedsVisit[projId] = (new Date()).toJSON();
    };

    Profile.prototype.getPadEditionCount = function(proj){
      var lastVisit =
        (this.lastPadVisit[proj.id])?
        new Date(this.lastPadVisit[proj.id]):new Date(0);

      if (lastVisit.getTime() < proj.pad.lastmodtime){
        return 1;
      } else {
        return 0;
      }
    };

    Profile.prototype.getNewMessagesCount = function(proj){
      var lastVisit =
        (this.lastChatVisit[proj.id])?
        new Date(this.lastChatVisit[proj.id]):new Date(0);

      var chatsLength = proj.chat.length;

      if (chatsLength > 0){
        var i = chatsLength - 1;
        while (i > -1 && (new Date(proj.chat[i].time) > lastVisit)) {
          i --;
        }
        return chatsLength -1 -i;
      } else {
        return 0;
      }
    };
    // Service methods //

    // map of opened profiles
    var openedProfiles = {};
    // map of created profiles
    var createdProfiles = {};

    var current = function(){
      return getOrCreateProfile(SessionSvc.users.current());
    };

    // check that the profile does not exists before calling this method
    var createProfile = function(userName) {
      if (!createdProfiles[userName]) {
        var def = $q.defer();
        createdProfiles[userName] = def.promise;
        window.SwellRT.createModel(
          function(model) {
            var proxy;
            $timeout(function(){
              proxy = swellRT.proxy(model, Profile);
            });
            $timeout(function(){
              proxy.type = 'userProfile';
              proxy.userName = userName;
              def.resolve(proxy);
            });
          });
      }
      return createdProfiles[userName];
    };

    var getProfile = function(userName) {

      if (!openedProfiles[userName]){
        var def = $q.defer();
        openedProfiles[userName] = def.promise;
        window.SwellRT.query(
          {
            'root.type' : 'userProfile',
            'root.userName' : userName
          }, function(result) {
            // check that there is one and only one profile for the user
            if (result.result.length < 1) {
              def.reject('Profile not found');
              return;
            } else if (result.result.length > 1) {
              def.reject('ERROR: More than one profile found for user ', userName);
              return;
            }
            window.SwellRT.openModel(result.result[0].wave_id,
              function(model) {


                $timeout(function(){
                  var proxy = swellRT.proxy(model, Profile);

                  def.resolve(proxy);
                });
              },
              function(error){
                def.reject(error);
              }
            );
          }
        );
      }
      return openedProfiles[userName];
    };

    var getOrCreateProfile = function(){
      var profileDef = $q.defer();
      getProfile(SessionSvc.users.current()).then(
        function(prof){
          profileDef.resolve(prof);
        }, function(error) {
          if (error === 'Profile not found'){
            createProfile(SessionSvc.users.current()).then(
              function(p) {
                profileDef.resolve(p);
              },
              function(error){
                profileDef.reject(error);
              }
            );
          }
        });
      return profileDef.promise;
    };

    return {
      current: current,
      create: createProfile,
      get: getProfile
    };

  }]);
