'use strict';

angular.module('Pear2Pear')
  .factory('ProjectsSvc', ['swellRT', '$q', '$timeout', 'base64', 'SwellRTSession', 'SwellRTCommon', 'ProfilesSvc', function(swellRT, $q, $timeout, base64, SwellRTSession, SwellRTCommon, ProfilesSvc){

    var Project = function(){};

    Project.prototype.addContributor = function(user) {
      if (!user){
        user = SwellRTSession.users.current();
      }
      if (user && this.contributors.indexOf(user) < 0){
        this.contributors.push(user);
      }
    };

    Project.prototype.setShareMode = function(shareMode){
      this.shareMode = shareMode;
    };

    //TODO profiles Service and bring this method there
    Project.prototype.timestampProjectAccess = function(){

      ProfilesSvc.current().then(function(profile) {
        profile.lastProjectVisit[this.id] = (new Date()).toJSON();
      });
    };

    Project.prototype.toogleSupport = function(){
      var index = this.supporters.indexOf(SwellRTSession.users.current());

      if (index > -1) {
        this.supporters.splice(index, 1);
      } else {
        this.supporters.push(SwellRTSession.users.current());
      }
    };

    // Service functions //

    var openedProjects = {};

    var find = function(urlId) {

      var id = base64.urldecode(urlId);
      var def = $q.defer();

      if (!openedProjects[id]) {
        openedProjects[id] = def.promise;
        SwellRT.openModel(id, function(model){
          var pr = swellRT.proxy(model, Project);
          def.resolve(pr);
        }, function(error){
          console.log(error);
          def.reject(error);
        });
      } else {
        openedProjects[id].then(
          function(r){
            def.resolve(r);
          });
      }
      return def.promise;
    };

    var create = function(callback, communityId) {

      var id = SwellRT.createModel(function(model){

        SwellRTCommon.makeModelPublic(model);
        var proxyProj = swellRT.proxy(model, Project);
        $timeout(function(){
          proxyProj.type = 'project';
          proxyProj.communities = (communityId) ? [communityId] : [];
          proxyProj.id = id;
          proxyProj.title = '';
          proxyProj.chat = [];
          proxyProj.pad = new swellRT.TextObject();
          proxyProj.needs = [];
          proxyProj.promoter = SwellRTSession.users.current();
          proxyProj.supporters = [];
          proxyProj.contributors = [SwellRTSession.users.current()];
          proxyProj.shareMode = 'link';
          var d = $q.defer();
          d.resolve(proxyProj);
          openedProjects[id] = d.promise;

          callback(proxyProj);
        });
      });
    };

    return {
      find: find,
      create: create
    };
  }]);
