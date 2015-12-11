'use strict';

angular.module('Pear2Pear')
  .factory('CommunitiesSvc', [
  'swellRT', '$q', '$timeout', 'base64', 'SessionSvc', 'SwellRTCommon', 'ProjectsSvc',
  function(swellRT, $q, $timeout, base64, SessionSvc, SwellRTCommon, ProjectsSvc){

    var Community = function(){};

    Community.prototype.myAndPublicProjects = function(){
      return ProjectsSvc.all({
         publicAndContributor: SessionSvc.users.current(),
         community: this.id
       });
    };

    Community.prototype.isParticipant = function(user){
      // Migrating from participants === undefined
      if (this.participants === undefined) {
        this.participants = [];
      }

      if (!user){
        user = SessionSvc.users.current();
      }
      return this.participants.indexOf(user) > -1;
    };

    Community.prototype.addParticipant = function(user) {
      if (!user){
        if (!SessionSvc.users.loggedIn()) {
          return;
        }

        user = SessionSvc.users.current();
      }

      if (this.isParticipant(user)) {
        return;
      }

      this.participants.push(user);
    };

    Community.prototype.removeParticipant = function(user) {
      if (!user){
        if (!SessionSvc.users.loggedIn()) {
          return;
        }

        user = SessionSvc.users.current();
      }

      if (! this.isParticipant(user)) {
        return;
      }

      this.participants.splice(
        this.participants.indexOf(user),
        1);
    };

    Community.prototype.toggleParticipant = function(user) {
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
    };

    // Service functions

    var openedCommunities = {};

    var find = function(urlId) {

      var id = base64.urldecode(urlId);
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
          p.name = data.name;
          p.id = id;
          p.participants = [SessionSvc.users.current()];
          p.projects = [];
          d.resolve(p);
        });
      });

      d.promise.then(callback);

      return d.promise;
    };

    var all = function() {

      var communities = $q.defer();
      var foundCommunities = $q.defer();
      var foundProjectNumbers = $q.defer();

      var queries = $q.all([
        foundCommunities.promise,
        foundProjectNumbers.promise
      ]);

      var comms = {};
      var nums = {};

      SwellRT.query(
        {
          'root.type': 'community'
        },
        function(result){
          angular.forEach(result.result, function(val) {
            comms[val.root.id] = val.root;
          });

          foundCommunities.resolve(comms);
        },
        function(e){
          foundCommunities.reject(e);
        }
      );

      SwellRT.query(
        {_aggregate:
         [{$match: {
           'root.type': 'project',
           'root.shareMode': 'public'
         }},
          {$unwind: '$root.communities'},
          {$group :
           {_id:'$root.communities',
            number: { $sum : 1 }
           }
          }]},
        function(result){
          nums = result.result;
          foundProjectNumbers.resolve(nums);
        },
        function(e){
          foundCommunities.reject(e);
        }
      );

      queries.then(function(){
        angular.forEach(nums, function(val){
          comms[val._id].numProjects = val.number;
        });

        communities.resolve(comms);
      });

      return communities.promise;
    };

    // The communities the user is participating in
    var participating = function() {
      if (!SessionSvc.users.loggedIn()) {
        return $q(function(resolve) {
          resolve([]);
        });
      }

      return $q(function(resolve, reject) {
        var query = {
          _aggregate: [
            {
              $match: {
                'root.type': 'community',
                'root.participants': SessionSvc.users.current()
              }
            }
          ]};

        SwellRT.query(
          query,
          function(result) {

            var res = [];

            angular.forEach(result.result, function(val){
              res.push(val.root);
            });

            resolve(res);
          },
          function(error){
            reject(error);
          }
        );
      });
    };

    var setCurrent = function(communityId) {
      return window.localStorage.setItem('communityId', communityId);
    };

    var current = function() {
      return window.localStorage.getItem('communityId');
    };

    return {
      find : find,
      create: create,
      all: all,
      participating: participating,
      setCurrent: setCurrent,
      current: current
    };
  }]);
