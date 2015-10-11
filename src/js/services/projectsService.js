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
      var proj = this;
      ProfilesSvc.current().then(function(profile) {
        profile.lastProjectVisit[proj.id] = (new Date()).toJSON();
      });
    };

    Project.prototype.toggleSupport = function(){
      if (SwellRTSession.users.current() === null) {
        return;
      }
      var index = this.supporters.indexOf(SwellRTSession.users.current());

      if (index > -1) {
        this.supporters.splice(index, 1);
      } else {
        this.supporters.push(SwellRTSession.users.current());
      }
    };

    Project.prototype.toggleContributor = function(){
      if (SwellRTSession.users.current() === null) {
        return;
      }
      var index = this.contributors.indexOf(SwellRTSession.users.current());

      if (index > -1) {
        this.contributors.splice(index, 1);
      } else {
        this.contributors.push(SwellRTSession.users.current());
      }
    };
    Project.prototype.addChatMessage = function(message){
      this.chat.push({
          text: message,
          who: SwellRTSession.users.current(),
          time: (new Date()).toJSON()
        });
      this.addContributor();
    };

    Project.prototype.addChatNotification = function(message, translateValues){
      this.chat.push({
        text: message,
        time: (new Date()).toJSON(),
        standpoint: 'notification',
        translateValues: translateValues
      });
    };

    Project.prototype.addNeedComment = function(need, comment){
      if (!need.comments){
        need.comments = [];
      }
      need.comments.push({
        text: comment,
        time: (new Date()).toJSON(),
        author: SwellRTSession.users.current()
      });
    };

    Project.prototype.isSupporter = function(user){
      if (!user){
        user = SwellRTSession.users.current();
      }
      return this.supporters.indexOf(user) > -1;
    };

    Project.prototype.isContributor = function(user){
      if (!user){
        user = SwellRTSession.users.current();
      }
      return this.contributors.indexOf(user) > -1;
    };

    // Service functions //

    var openedProjects = {};

    var find = function(urlId) {

      var id = base64.urldecode(urlId);
      var def = $q.defer();
      if (!openedProjects[id]) {
        openedProjects[id] = def.promise;
        SwellRT.openModel(id, function(model){
          $timeout(function(){
            var pr = swellRT.proxy(model, Project);
            def.resolve(pr);
          });
        }, function(error){
          console.log(error);
          def.reject(error);
        });
      }
      return openedProjects[id];
    };

    var create = function(callback, communityId) {
      var d = $q.defer();
      var id = SwellRT.createModel(function(model){
        openedProjects[id] = d.promise;

        SwellRTCommon.makeModelPublic(model);

        var proxyProj;

        $timeout(function(){
          proxyProj = swellRT.proxy(model, Project);
        });

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
          proxyProj.shareMode = 'public';
          d.resolve(proxyProj);
        });
      });

      d.promise.then(callback);

      return d.promise;
    };

    return {
      find: find,
      create: create
    };
  }]);
