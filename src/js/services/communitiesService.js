'use strict';

angular.module('Pear2Pear')
  .factory('CommunitiesSvc', ['swellRT', '$q', '$timeout', 'base64', 'SwellRTSession', 'SwellRTCommon', 'ProjectsSvc', function(swellRT, $q, $timeout, base64, SwellRTSession, SwellRTCommon, ProjectsSvc){

    var Community = function(){};

    Community.prototype.getProjectsSnapshot = function(){
      var foundProjects = $q.defer();
      SwellRT.query(
        {
          'root.type': 'project',
          'root.communities': this.id,
          'root.shareMode': 'public'
        },
        function(result){
          var projs = [];
          angular.forEach(result.result, function(val) {
            projs.push(val.root);
          });
          foundProjects.resolve(projs);
        },
        function(e){
          foundProjects.reject(e);
        }
      );
      return foundProjects.promise;
    };

    Community.prototype.getProjects = function(){
      var projsDef = $q.defer();
      this.getProjectsSnapshot().then(function(all){
        var promises = {};
        if (all.length > 0){
          angular.forEach(all, function(val){
            var projDef = $q.defer();
            promises[val.id] = projDef.promise;
            // TODO create ProjectsSvc
            ProjectsSvc.find(base64.urlencode(val.id)).then(function(model){
              $timeout(function(){
                projDef.resolve(model);
              });
            });
          });
          projsDef.resolve($q.all(promises));
        } else {
          projsDef.resolve([]);
        }
      });
      return projsDef.promise;
    };

    // return the collection of projects of current user in the community as snapshots
    Community.prototype.myProjects = function(){
      var myProjs = $q.defer();

      var query = {
        _aggregate: [
          {
            $match: {
              'root.type': 'project',
              'root.contributors': SwellRTSession.users.current()
            }
          }
        ]};

      if (this.id){
        query._aggregate[0].$match['root.communities'] = base64.urldecode(this.id);
      }

      SwellRT.query(
        query,
        function(result) {

          var res = [];

          angular.forEach(result.result, function(val){
            res.push(val.root);
          });

          myProjs.resolve(res);
        },
        function(error){
          myProjs.reject(error);
        });
      return myProjs.promise;
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

          var pr = swellRT.proxy(model, Community);

          comDef.resolve(pr);
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
      var id = window.SwellRT.createModel(function(model){

        SwellRTCommon.makeModelPublic(model);
        var p = swellRT.proxy(model, Community);

        $timeout(function(){
          p.type = 'community';
          p.name = data.name;
          p.id = id;
          p.projects = [];

          callback(p);
        });
      });
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

    var setCurrent = function(communityId) {
      return window.localStorage.setItem('communityId', communityId);
    };

    return {
      find : find,
      create: create,
      all: all,
      setCurrent: setCurrent
    };
  }]);
