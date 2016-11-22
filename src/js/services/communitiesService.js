'use strict';

angular.module('Teem')
  .factory('CommunitiesSvc', [
  'swellRT', '$q', '$timeout', 'base64', 'SessionSvc', 'SwellRTCommon', 'ProjectsSvc',
  'User', '$rootScope', 'Logo', 'Url', 'Participation',
  function(swellRT, $q, $timeout, base64, SessionSvc, SwellRTCommon, ProjectsSvc,
  User, $rootScope, Logo, Url, Participation){

    class CommunityReadOnly extends aggregation(Object, Logo, Url, Participation.ReadOnly) {

      // model is a readOnly object from a SwellRT query result
      constructor (model) {
        // calling "this" is not allowed before super()
        super();

        if (model) {
          for (var k in model.root){
            if (model.root.hasOwnProperty(k)){
              this[k] = model.root[k];
            }
          }
          this._participants = model.participants;
          this.numProjects = model.numProjects;
        }
      }

      get pathPrefix () { return '/communities/'; }

      nameForPotTag () {
        if (! this.name ) {
          return '';
        }

        var wordLength = 14,
            lines = [[], []],
            tagLength = wordLength * lines.length + lines.length,
            words = this.name.split(' '),
            shorterName;

        // Short words that are longer than lineLength
        angular.forEach(words, function(word, index) {
          if (word.length > wordLength) {
            words[index] = word.substring(0, wordLength - 3) + '...';
          }
        });

        shorterName = words.join(' ');

        // Change '...' at the end of last word if required
        if (shorterName.length > tagLength &&
            shorterName.charAt(tagLength - 1 !== ' ') &&
            shorterName.charAt(tagLength - 2 !== ' ')) {

          let lastWord = words.pop();

          if (lastWord.length > 3) {
            lastWord = lastWord.substring(0, lastWord.length - 3) + '...';

            words.push(lastWord);
          }
        }

        // Add <br> in the middle of the name to break it in two lines
        lines[0].push(words.shift());

        while (words.length) {
          if (lines[0].join(' ').length <= lines[1].join(' ').length) {
            lines[0].push(words.shift());
          } else {
            lines[1].unshift(words.pop());
          }
        }

        return lines[0].join(' ') + (
          lines[1].length ?
            '<br />' + lines[1].join(' ') :
            '');
      }

      myAndPublicProjects (options = {}) {
        options.community = this.id;
        options.projection = ProjectsSvc.projectListProjection;

        return ProjectsSvc.all(options);
      }
    }

    class Community extends aggregation(CommunityReadOnly, Participation.ReadWrite, SessionSvc.SynchedModel) {

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

        swellRT.openModel(id, function(model){

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

    var create = function(options, callback) {
      var d = $q.defer();

      swellRT.createModel(function(model){

        openedCommunities[model.id()] = d.promise;

        SwellRTCommon.makeModelPublic(model);

        var p;

        $timeout(function(){
          p = swellRT.proxy(model, Community);

          console.log('inside');

          p.type = 'community';
          p.id = model.id();
          if (options.name) {
            p.name = options.name;
          }
          p.projects = [];

          d.resolve(p);
        });
      });

      d.promise.then(callback);

      return d.promise;
    };

    /*
     * Build options for all query
     */
    function buildAllQuery(options) {
      var query = {
        _aggregate: [
          {
            $match: {
              $or: [
                {$and: [
                  {'root.type': 'community'},
                  {'root.name': {$ne : ''}}
                ]},
                {$and: [
                  {'root.type': 'project'},
                  {'root.shareMode': 'public'}
                ]
              }
            ]}
          },
          {
            $project: {
              coms: {
                $ifNull: [
                  '$root.communities',
                  ['$root.id']
                ]
              },
              root: {
                $cond: [
                  {
                    $eq: [
                      '$root.type', 'community'
                    ]
                  },
                  '$root',
                  null
                ]
              },
              participants: {
                $cond: [
                  {
                    $eq: [
                      '$root.type', 'community'
                    ]
                  },
                  '$participants',
                  null
                ]
              }
            }
          },
          {
            $unwind: '$coms'
          },
          {
            $sort: {root: -1}
          },
          {
            $group: {
              _id: '$coms',
              numProjects: {
                $sum: {
                  $cond: [
                    { $eq: [ '$root.type', 'community' ] },
                      0, 1
                    ]
              }},
              'root': {$first: '$root'},
              'participants': {$first: '$participants'}
            }
          },
          {
            $match: {
              'root': {$ne: null}
            }
          },
          {
            $sort:
              { numProjects : -1}
          },
          {
            $skip: options.pagination.pageIndex * options.pagination.pageSize
          },
          {
            $limit: options.pagination.pageSize
          }
          ]};

      // being query._aggregate[0].$match.$or[0].$and[0] = {'root.type': 'community'}
      var matchComSubQuery = query._aggregate[0].$match.$or[0].$and;

      if (options.ids) {

        matchComSubQuery.push({
          'root.id': { $in: options.ids }
        });

      }

      if (options.participant) {

        matchComSubQuery.push({
          participants: options.participant
        });

      }

      if (options.nameLike) {

        matchComSubQuery.push({
          'root.name': {
            $regex: options.nameLike,
            $options: 'i'
          }
        });
      }

      return query;
    }

    /*
     * Find all the communities that meet some condition
     */
    function all (options = {}) {

      if (!options.pagination) {
        options.pagination = {};
      }

      if (!options.pagination.pageSize) {
        options.pagination.pageSize = 12;
      }

      if (!options.pagination.pageIndex) {
        options.pagination.pageIndex = 0;
      }

      var communities = [],
          query = buildAllQuery(options);

      var nextPage = function () {

        // build a new options parameter for next page
        var nextPageOptions = options;
        nextPageOptions.pagination.pageIndex += 1;

        return all(nextPageOptions);
      };

      var commsPromise = $q(function(resolve, reject) {

        swellRT.query(query, function(result) {
            angular.forEach(result.result, function(c) {
              communities.push(new CommunityReadOnly(c));
            });
            resolve(communities);
          },
          function(e){
            reject(e);
          }
        );
      });

      commsPromise.next = nextPage;

      return commsPromise;
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
            {_id: '$participants'}
          },
          {$project: '_id'}
        ]};

        var def = $q.defer();

        swellRT.query(query, function(a){
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
      communitiesContributors,
      CommunityReadOnly
    };
  }]);
