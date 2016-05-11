'use strict';

angular.module('Teem')
  .factory('CommunitiesSvc', [
  'swellRT', '$q', '$timeout', 'base64', 'SessionSvc', 'SwellRTCommon', 'ProjectsSvc',
  'User', '$rootScope', 'Logo',
  function(swellRT, $q, $timeout, base64, SessionSvc, SwellRTCommon, ProjectsSvc,
  User, $rootScope, Logo){

    class CommunityReadOnly extends aggregation(Logo) {

      constructor (val) {
        // calling "this" is not allowed before super()
        super();

        if (val) {
          for (var k in val.root){
            if (val.root.hasOwnProperty(k)){
              this[k] = val.root[k];
            }
          }
          this._participants = val.participants;
        }
      }

      get urlId () {
        if (! this._urlId) {
          this._urlId = base64.urlencode(this.id);
        }

        return this._urlId;
      }

      myAndPublicProjects () {
        return ProjectsSvc.all({
           publicAndContributor: SessionSvc.users.current(),
           community: this.id
         });
      }

      isParticipant (user = SessionSvc.users.current()) {
        if (! user) {
          return false;
        }

        return this._participants.indexOf(user) > -1;
      }

      participantCount () {
        return this._participants.reduce(function(a,b){
          // do not count participants of the form @domain that represents that it is a public wave.
          return a + (/.+@.+/.test(b)? 1 : 0);
        }, 0);
      }
    }

    class Community extends CommunityReadOnly {

      addParticipant (user) {
        if (!user){
          if (!SessionSvc.users.loggedIn()) {
            return;
          }

          user = SessionSvc.users.current();
        }

        if (this.isParticipant(user)) {
          return;
        }

        this._participants.push(user);

        if (user === User.currentId()) {
          $rootScope.$broadcast('teem.community.join');
        }
      }

      removeParticipant (user) {
        if (!user){
          if (!SessionSvc.users.loggedIn()) {
            return;
          }

          user = SessionSvc.users.current();
        }

        if (! this.isParticipant(user)) {
          return;
        }

        this._participants.splice(
          this._participants.indexOf(user),
          1);

          if (user === User.currentId()) {
            $rootScope.$broadcast('teem.community.leave');
          }
      }

      toggleParticipant (user) {
        if (!user){
          if (!SessionSvc.users.loggedIn()) {
            return;
          }

          user = SessionSvc.users.current();
        }

        if (this.isParticipant(user)) {
          this.removeParticipant(user);
        } else {
          this.addParticipant(user);
        }
      }

      delete () {
        this.type = 'deleted';

        //TODO remove pointers from project.communities
      }
    }

    // Service functions

    var openedCommunities = {};

    var find = function(id) {
      var comDef = $q.defer();
      var community = comDef.promise;

      if (!openedCommunities[id]) {
        openedCommunities[id] = community;

        SwellRT.openModel(id, function(model){

          $timeout(function(){
            var pr = swellRT.proxy(model, Community);

            comDef.resolve(pr);
          });

        }, function(error){

          console.log(error);

          comDef.reject(error);
        });
      } else {
        openedCommunities[id].then(
          function(r){
            comDef.resolve(r);
          });
      }

      return community;
    };

    function findByUrlId(urlId) {
      return find(base64.urldecode(urlId));
    }

    var create = function(data, callback) {
      var d = $q.defer();
      var id = window.SwellRT.createModel(function(model){
        openedCommunities[id] = d.promise;
        SwellRTCommon.makeModelPublic(model);

        var p;

        $timeout(function(){
          p = swellRT.proxy(model, Community);
        });

        $timeout(function(){
          p.type = 'community';
          p.id = id;
          p.projects = [];
          d.resolve(p);
        });
      });

      d.promise.then(callback);

      return d.promise;
    };

    /*
     * Count the projects these communities have
     * FIXME: Use ProjectsSvc for this
     */
    function countProjects (communities) {

      return $q(function (resolve, reject) {

        SwellRT.query(
          {_aggregate:
             [{$match: {
               'root.type': 'project',
               'root.shareMode': 'public',
               'root.communities': { $in: communities.map(c => c.id) }
             }},
              {$unwind: '$root.communities'},
              {$group :
               {_id:'$root.communities',
                number: { $sum : 1 }
               }
              }]},
            function(result){
              var counters = result.result;

              angular.forEach(communities, function (c) {
                angular.forEach(counters, function (cnt) {
                  if (c.id === cnt._id) {
                    c.numProjects = cnt.number;
                  }
                });

                if (c.numProjects === undefined) {
                  c.numProjects = 0;
                }
              });

              resolve();
            },
            function(e){
              reject(e);
            });
      });
    }

    /*
     * Build options for all query
     */
    function buildAllQuery(options) {
      var query = {
        _aggregate: [
          {
            $match: {
              'root.type': 'community'
            }
          }
        ]
      };

      if (options.ids) {
        query._aggregate[0].$match['root.id'] = { $in: options.ids };
      }

      if (options.participant) {
        query._aggregate[0].$match.participants = options.participant;
      }

      return query;
    }

    /*
     * Find all the communities that meet some condition
     */
    function all (options = {}) {
      var communities = [],
          query = buildAllQuery(options);

      return $q(function(resolve, reject) {

        SwellRT.query(query, function(result) {
            angular.forEach(result.result, function(c) {
              communities.push(new CommunityReadOnly(c));
            });

            if (options.projectCount) {
              countProjects(communities)
                .then(function () {
                  resolve(communities);
                }, function (error) {
                  reject(error);
                });
            } else {
              resolve(communities);
            }
          },
          function(e){
            reject(e);
          }
        );
      });
    }

    // The communities the user is participating in
    var participating = function(options = {}) {
      if (!SessionSvc.users.loggedIn()) {
        return $q(function(resolve) {
          resolve([]);
        });
      }

      options.participant = SessionSvc.users.current();

      return all(options);
    };

    // List of community menbers and contributors of communities teems
    // for the communities with id in the ids array
    var communitiesContributors = function (ids) {

      if (ids === undefined || ids === []){
        return $q(function(resolve) {
          resolve([]);
        });
      }
      if (typeof ids === String){
        ids = [ids];
      }

      var query = {
        _aggregate: [
          {$match: {
            'root.type': {$in: ['project','community']},
            'root.shareMode': 'public',
            'root.communities': {$in: ids}
          }},

          {$unwind: '$participants'},
          {$group :
            {_id:'$participants'}
          }
        ]};

        var def = $q.defer();

        SwellRT.query(query, function(a){
          def.resolve(a.result);
        }, function(error){
          def.reject(error);
        });

        return def.promise;
      };

    return {
      findByUrlId,
      find,
      create,
      all,
      participating,
      communitiesContributors
    };
  }]);
