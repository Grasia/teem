'use strict';

angular.module('Teem')
  .factory('ProjectsSvc', [
  'swellRT', '$q', '$timeout', 'base64', 'SessionSvc', 'SwellRTCommon', 'User', '$rootScope',
  function(swellRT, $q, $timeout, base64, SessionSvc, SwellRTCommon, User, $rootScope){

    // class that expose only read methods of the project object
    class ProjectReadOnly {
      constructor (val) {
        if (val) {
          for (var k in val.root){
            if (val.root.hasOwnProperty(k)){
              this[k] = val.root[k];
            }
          }
        }
      }

      get urlId () {
        if (! this._urlId) {
          this._urlId = base64.urlencode(this.id);
        }

        return this._urlId;
      }

      getTimestampAccess () {
        var access;

        if (this.lastAccesses === undefined) {
          this.lastAccesses = [];
        }

        angular.forEach(this.lastAccesses, function(a) {
          if (a.user === User.currentId()) {
            access = a;
          }
        });

        return access;
      }

      // section in {'chat', 'pad', 'needs'}
      lastChange (section) {
        if (section === undefined) {
          //cast to Date
          return new Date(Math.max(
            this.lastChange('chat').getTime(),
            this.lastChange('pad').getTime(),
            this.lastChange('needs').getTime()
          ));
        } else {
          switch (section) {

          case 'chat':
            if (this.chat && this.chat.length > 0) {
              return new Date(this.chat[this.chat.length -1].time);
            } else {
              return new Date(0);
            }
            break;

          case 'pad':
            return new Date(this.pad.lastmodtime) || new Date(0);

          case 'needs':
            var lastChange = new Date(0);
            angular.forEach(this.needs, function(n){
              lastChange = Math.max(
                lastChange,
                new Date(n.time||0),
                (function() {
                  var lastComment = new Date(0);
                  angular.forEach(n.comments, function(c){
                    lastComment = Math.max(lastComment, new Date(c.time || 0));
                  });
                  return lastComment;
                }())
              );
            });
            // cast to Date
            return new Date(lastChange);

          default:
            return new Date(0);
          }
        }
      }

      // section in {'chat', 'pad', 'needs'}
      // pos in {'last','prev'}
      lastAccess (section, pos) {
        var access;

        angular.forEach(this.lastAccesses || [], function(a) {
          if (a.user === User.currentId()) {
            access = a;
          }
        });

        if (!pos) {
          pos = 'last';
        }

        return (access && access[section] && access[section][pos] ? new Date(access[section][pos]) : new Date(0));
      }

      newMessagesCount () {
        var access = this.lastAccess('chat');

        if (this.chat.length > 0){
          var i = this.chat.length - 1;

          while (i > -1 && (new Date(this.chat[i].time) > access)) {
            i --;
          }
          return this.chat.length - 1 - i;
        } else {
          return 0;
        }
      }

      padEditionCount () {
        if (this.lastAccess('pad').getTime() < this.pad.lastmodtime) {
          return 1;
        } else {
          return 0;
        }
      }

      isSupporter (userId = User.currentId()) {
        if (!userId) {
          return false;
        }

        return this.supporters.indexOf(userId) > -1;
      }

      isContributor (userId = User.currentId()) {
        if (! userId) {
          return false;
        }
        return this._participants.indexOf(userId) > -1;
      }

      needCompletedCount () {
        var completed = 0;

        angular.forEach(this.needs, function(need) {
          if (need.completed === 'true') {
            completed++;
          }
        });

        return completed;
      }

      needIncompletedCount () {
        return this.needCount() - this.needCompletedCount();
      }

      needCount () {
        if (this.needs === undefined) {
          return 0;
        }

        return this.needs.length;
      }

      progressPercentage () {
        var size = this.needCount();

        if (size === 0) {
          return 0;
        }

        return Math.round(this.needCompletedCount() * 100 / size);
      }

      // Show at least 1%
      progressPercentageNotZero () {
        var value = this.progressPercentage();

        if (value === 0 && this.needCount() > 0) {
          return 1;
        }

        return value;
      }

      progressType () {
        var percentage = this.progressPercentage();

        if (percentage < 33) {
          return 'danger';
        } else if (percentage > 66) {
          return 'success';
        } else {
          return 'warning';
        }
      }

      isShareMode (mode) {
        return mode === this.shareMode;
      }
    }

    class Project extends ProjectReadOnly {

      addContributor (userId = User.currentId()) {

        if (userId && this._participants.indexOf(userId) < 0){
          this._participants.push(userId);

          if (userId === User.currentId()){
            $rootScope.$broadcast('teem.project.join');
          }
        }

        if (userId === User.currentId()){
          $rootScope.$broadcast('teem.project.join');
        }
      }

      setShareMode (shareMode) {
        this.shareMode = shareMode;
      }

      /*
       * Record when the user had her last and previous access to one project section
       */
      setTimestampAccess (section, overridePrev) {
        if (! this.isContributor()) {
          return;
        }

        if (this.getTimestampAccess() === undefined){
          this.lastAccesses.push({user: User.currentId()});
        }
        var timestamp = this.getTimestampAccess()[section];

        if (timestamp === undefined) {
          timestamp = {};
        }

        if (timestamp instanceof Date) {
          timestamp = {
            last: timestamp
          };
        }

        if(! overridePrev){
          timestamp.prev = timestamp.last || (new Date()).toJSON();
        } else {
          timestamp.prev = (new Date()).toJSON();
        }

        timestamp.last = (new Date()).toJSON();

        this.getTimestampAccess()[section] = timestamp;
      }

      toggleSupport () {

        var userId = User.currentId();

        if (userId === undefined) {
          return;
        }
        var index = this.supporters.indexOf(userId);

        if (index > -1) {
          this.supporters.splice(index, 1);
        } else {
          this.supporters.push(userId);
        }
      }


      removeContributor (userId = User.currentId()) {

        this._participants.splice(
          this._participants.indexOf(userId),
          1);

        if (userId === User.currentId()){
          $rootScope.$broadcast('teem.project.leave');
        }
      }

      toggleContributor () {
        if (! SessionSvc.users.loggedIn()) {
          return;
        }

        var userId = User.currentId();

        if (this.isContributor(userId)) {
          this.removeContributor(userId);
        } else {
          this.addContributor(userId);
        }
      }

      participantCount () {
        return this._participants.reduce(function(a,b){
          // do not count participants of the form @domain that represents that it is a public wave.
          return a + (/.+@.+/.test(b)? 1 : 0);
        }, 0);
      }

      addChatMessage (message) {
        this.chat.push({
          text: message,
          who: User.currentId(),
          time: (new Date()).toJSON()
        });
        this.addContributor();
        this.setTimestampAccess('chat', true);
      }

      addNeedComment (need, comment) {
        if (!need.comments){
          need.comments = [];
        }
        need.comments.push({
          text: comment,
          time: (new Date()).toJSON(),
          author: User.currentId()
        });
        this.setTimestampAccess('needs', true);
      }

      delete () {
        this.type = 'deleted';
        this.communities = [];
      }
    }

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
        query._aggregate[0].$match.participants = options.contributor;
      }

      if (options.community) {
        query._aggregate[0].$match['root.communities'] = options.community;
      }

      if (options.localId) {
        query._aggregate[0].$match['root.localId'] = options.localId;
      }

      if (options.shareMode) {
        query._aggregate[0].$match['root.shareMode'] = 'public';
      }

      if (options.publicAndContributor) {
        query._aggregate[0].$match.$or = [
          { 'participants': options.publicAndContributor },
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

            var v = new ProjectReadOnly(val);

            res.push(v);
          });

          resolve(res);
        },
        function(error){
          console.log(error);

          reject([]);
        });
      });
    }

    function contributing () {

      if (!SessionSvc.users.loggedIn()) {
        return $q(function(resolve) {
          resolve([]);
        });
      }

      return all({ contributor: User.currentId()});
    }

    function find(id) {
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
    }

    function findByUrlId(urlId) {
      return find(base64.urldecode(urlId));
    }

    function create(options, callback) {
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
          proxyProj.communities =
           (options.communityId) ? [ options.communityId ] : [];
          proxyProj.id = id;
          proxyProj.title = '';
          proxyProj.chat = [];
          proxyProj.pad = new swellRT.TextObject();
          proxyProj.needs = [];
          proxyProj.lastAccesses = [];
          proxyProj.promoter = User.currentId();
          proxyProj.supporters = [];
          proxyProj.shareMode = 'public';
          d.resolve(proxyProj);
        });
      });

      d.promise.then(callback);

      return d.promise;
    }

    return {
      all,
      contributing,
      findByUrlId,
      find,
      create
    };
  }]);
