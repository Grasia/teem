'use strict';

angular.module('Teem')
  .factory('ProjectsSvc', [
  'swellRT', '$q', '$timeout', 'base64', 'SessionSvc', 'SwellRTCommon', 'ProfilesSvc',
  function(swellRT, $q, $timeout, base64, SessionSvc, SwellRTCommon, ProfilesSvc){

    var Project = function(){};

    Project.prototype.addContributor = function(user) {
      if (!user){
        user = SessionSvc.users.current();
      }
      if (user && this.contributors.indexOf(user) < 0){
        this.contributors.push(user);
      }
    };

    Project.prototype.setShareMode = function(shareMode){
      this.shareMode = shareMode;
    };

    Project.prototype.getTimestampAccess = function() {
      var access;

      this.lastAccesses = this.lastAccesses || [];

      angular.forEach(this.lastAccesses, function(a) {
        if (a.user === SessionSvc.users.current()) {
          access = a;
        }
      });

      if (! access) {
        access = {
          user: SessionSvc.users.current()
        };

        this.lastAccesses.push(access);
      }

      return access;
    };

    /*
     * Record when the user had her last access to one project section
     */
    Project.prototype.setTimestampAccess = function(section){
      if (! this.isContributor()) {
        return;
      }

      this.getTimestampAccess()[section] =
        (new Date()).toJSON();
    };

    Project.prototype.toggleSupport = function(){
      if (SessionSvc.users.current() === null) {
        return;
      }
      var index = this.supporters.indexOf(SessionSvc.users.current());

      if (index > -1) {
        this.supporters.splice(index, 1);
      } else {
        this.supporters.push(SessionSvc.users.current());
      }
    };

    Project.prototype.removeContributor = function(user) {
      if (!user){
        user = SessionSvc.users.current();
      }

      this.contributors.splice(
        this.contributors.indexOf(user),
        1);
    };

    Project.prototype.toggleContributor = function(){
      if (! SessionSvc.users.loggedIn()) {
        return;
      }

      var user = SessionSvc.users.current();

      if (this.isContributor(user)) {
        this.removeContributor(user);
      } else {
        this.addContributor(user);
      }
    };

    Project.prototype.addChatMessage = function(message){
      this.chat.push({
          text: message,
          who: SessionSvc.users.current(),
          time: (new Date()).toJSON()
        });
      this.addContributor();
    };

    Project.prototype.addNeedComment = function(need, comment){
      if (!need.comments){
        need.comments = [];
      }
      need.comments.push({
        text: comment,
        time: (new Date()).toJSON(),
        author: SessionSvc.users.current()
      });
    };

    Project.prototype.isSupporter = function(user){
      if (!user){
        if (! SessionSvc.users.loggedIn()) {
          return false;
        }

        user = SessionSvc.users.current();
      }
      return this.supporters.indexOf(user) > -1;
    };

    Project.prototype.isContributor = function(user){
      if (! user){
        if (! SessionSvc.users.loggedIn()) {
          return false;
        }

        user = SessionSvc.users.current();
      }
      return this.contributors.indexOf(user) > -1;
    };

    // Service functions //

    var openedProjects = {};

    /*
     * Build options for all query
     */
    function buildAllQuery(options) {
      var query = {
        _aggregate: [
          {
            $match: {
              'root.type': 'project'
            }
          }
        ]
      };

      if (options.contributor) {
        query._aggregate[0].$match['root.contributors'] = options.contributor;
      }

      if (options.community) {
        query._aggregate[0].$match['root.communities'] = options.community;
      }

      if (options.publicAndContributor) {
        query._aggregate[0].$match.$or = [
          { 'root.contributors': options.publicAndContributor },
          { 'root.shareMode': 'public' }
        ];
      }

      return query;
    }

    /*
     * Find all the projects that meet some condition
     */
    function all(options) {
      var query = buildAllQuery(options);

      return $q(function(resolve, reject) {
        var res = [];

        SwellRT.query(query, function(result) {

          angular.forEach(result.result, function(val){
            res.push(val.root);
          });

          resolve(res);
        },
        function(error){
          console.log(error);

          reject([]);
        });
      });
    }

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
          proxyProj.lastAccesses = [];
          proxyProj.promoter = SessionSvc.users.current();
          proxyProj.supporters = [];
          proxyProj.contributors = [SessionSvc.users.current()];
          proxyProj.shareMode = 'public';
          d.resolve(proxyProj);
        });
      });

      d.promise.then(callback);

      return d.promise;
    };

    return {
      all: all,
      find: find,
      create: create
    };
  }]);
