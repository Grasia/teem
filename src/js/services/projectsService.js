'use strict';

angular.module('Teem')
  .factory('ProjectsSvc', [
    'swellRT', '$q', '$timeout', 'base64', 'SessionSvc', 'SwellRTCommon', 'User',
    '$rootScope', 'Logo', 'Url', 'Participation', 'trelloSvc', '$location',
    function (swellRT, $q, $timeout, base64, SessionSvc, SwellRTCommon, User,
              $rootScope, Logo, Url, Participation, trelloSvc, $location) {

      // class that expose only read methods of the project object
      class ProjectReadOnly extends aggregation(Object, Logo, Url, Participation.ReadOnly) {

        // val is a readOnly object from a SwellRT query result
        constructor(val) {
          // calling "this" is not allowed before super()
          super();

          if (val) {
            for (var k in val.root) {
              if (val.root.hasOwnProperty(k)) {
                this[k] = val.root[k];
              }
            }
            this._participants = val.participants;
            if (val._id && val._id.$oid) {
              this._creationDate =
                parseInt(val._id.$oid.slice(0, 8), 16) * 1000;
            } else {
              this._creationDate = 0;
            }
          }
        }

        get pathPrefix() {
          return '/teems/';
        }

        getTimestampAccess() {
          var access;

          if (this.lastAccesses === undefined) {
            this.lastAccesses = [];
          }

          angular.forEach(this.lastAccesses, function (a) {
            if (a.user === User.currentId()) {
              access = a;
            }
          });

          return access;
        }

        // section in {'chat', 'pad', 'needs'}
        lastChange(section) {
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
                  return new Date(this.chat[this.chat.length - 1].time);
                } else {
                  return new Date(0);
                }
                break;

              case 'pad':
                return new Date(this.pad.lastmodtime) || new Date(0);

              case 'needs':
                var lastChange = new Date(0);
                angular.forEach(this.needs, function (n) {
                  lastChange = Math.max(
                    lastChange,
                    new Date(n.time || 0),
                    (function () {
                      var lastComment = new Date(0);
                      angular.forEach(n.comments, function (c) {
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

        get creationDate() {
          return this._creationDate;
        }

        // section in {'chat', 'pad', 'needs'}
        // pos in {'last','prev'}
        lastAccess(section, pos) {
          var access;

          angular.forEach(this.lastAccesses || [], function (a) {
            if (a.user === User.currentId()) {
              access = a;
            }
          });

          if (!pos) {
            pos = 'last';
          }

          return (access && access[section] && access[section][pos] ? new Date(access[section][pos]) : new Date(0));
        }

        newMessagesCount() {
          var access = this.lastAccess('chat');

          if (this.chat.length > 0) {
            var i = this.chat.length - 1;

            while (i > -1 && (new Date(this.chat[i].time) > access)) {
              i--;
            }
            return this.chat.length - 1 - i;
          } else {
            return 0;
          }
        }

        padEditionCount() {
          if (this.lastAccess('pad').getTime() < this.pad.lastmodtime) {
            return 1;
          } else {
            return 0;
          }
        }

        isFeatured() {
          return this.featured !== undefined && this.featured !== 'false';
        }

        featureDate() {
          if (this.isFeatured()) {
            return parseInt(this.featured) || 0;
          } else {
            return -1;
          }
        }

        isSupporter(userId = User.currentId()) {
          if (!userId) {
            return false;
          }

          return this.supporters.indexOf(userId) > -1;
        }

        needCompletedCount() {
          var completed = 0;

          angular.forEach(this.needs, function (need) {
            if (need.completed === 'true') {
              completed++;
            }
          });

          return completed;
        }

        needIncompletedCount() {
          return this.needCount() - this.needCompletedCount();
        }

        needCount() {
          if (this.needs === undefined) {
            return 0;
          }

          return this.needs.length;
        }

        progressPercentage() {
          var size = this.needCount();

          if (size === 0) {
            return 0;
          }

          return Math.round(this.needCompletedCount() * 100 / size);
        }

        // Show at least 1%
        progressPercentageNotZero() {
          var value = this.progressPercentage();

          if (value === 0 && this.needCount() > 0) {
            return 1;
          }

          return value;
        }

        progressType() {
          var percentage = this.progressPercentage();

          if (percentage < 33) {
            return 'danger';
          } else if (percentage > 66) {
            return 'success';
          } else {
            return 'warning';
          }
        }

        isShareMode(mode) {
          return mode === this.shareMode;
        }
      }

      class Project extends aggregation(ProjectReadOnly, Participation.ReadWrite, SessionSvc.SynchedModel) {

        setShareMode(shareMode) {
          this.shareMode = shareMode;
        }

        /*
         * Record when the user had her last and previous access to one project section
         */
        setTimestampAccess(section, overridePrev) {
          if (!this.isParticipant()) {
            return;
          }

          if (this.getTimestampAccess() === undefined) {
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

          if (!overridePrev) {
            timestamp.prev = timestamp.last || (new Date()).toJSON();
          } else {
            timestamp.prev = (new Date()).toJSON();
          }

          timestamp.last = (new Date()).toJSON();

          this.getTimestampAccess()[section] = timestamp;
        }

        toggleSupport() {

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

        addAttachment(file) {
          if (!file) {
            return;
          }
          if (typeof this.attachments === 'undefined') {
            this.attachments = {};
          }
          var swellFile = new swellRT.FileObject(file);
          var id = Math.floor((1 + Math.random()) * 0x100000000000000).toString(16);
          this.attachments[id] = {
            id,
            file: swellFile,
            who: User.currentId(),
            time: (new Date()).toJSON()
          };
          return id;
        }

        addChatMessage(text, file) {
          if (file) {
            file = new swellRT.FileObject(file);
          }
          this.chat.push({
            text,
            file,
            who: User.currentId(),
            time: (new Date()).toJSON()
          });

          this.setTimestampAccess('chat', true);
        }

        findNeed(id) {
          return this.needs.filter(function (need) {
            return need._id === id;
          })[0];
        }

        addNeed(need) {
          // Quick dirty hack until SwellRT provides ids for array elements
          need._id = Math.random().toString().substring(2);
          need.author = SessionSvc.users.current();
          need.time = (new Date()).toJSON();
          need.completed = 'false';

          this.setTimestampAccess('needs', true);

          if (this.trello) {
            if (this.trello.boardId && this.trello.listId) {
              trelloSvc.addNewCard(this.trello, need).
                then((cardData) => {
                  need.trelloId = cardData.id;
                  this.needs.push(need);
                })
                  .catch(err => console.log(err));
            }
          }
          else{
            this.needs.push(need);
          }

          return need;
        }

        toggleNeedCompleted(need) {
          var newStatus;

          if (!this.isParticipant()) {
            return;
          }

          newStatus = need.completed !== 'true';

          need.completed = newStatus.toString();

          if (newStatus) {
            need.completionDate = (new Date()).toJSON();
            trelloSvc.archiveCard(this.trello,need).
              then(data => need.closed = true)
              .catch(err => console.log(err));
          } else {
            trelloSvc.unarchiveCard(this.trello,need).
              then(data => {need.closed = false;})
              .catch(err => console.log(err));
            delete need.completionDate;
          }
        }

        toggleFeatured() {
          if (!this.isParticipant()) {
            return;
          }

          if (this.isFeatured()) {
            this.featured = 'false';
          } else {
            this.featured = new Date().getTime().toString();
          }
        }

        removeNeed(need) {
          var i = this.needs.indexOf(need);

          this.needs.splice(i, 1);

          trelloSvc.archiveNeed(this.trello,need).
            then(data => need.removed = true)
            .catch(err => console.log(err));
        }

        addNeedComment(need, comment) {
          if (!need.comments) {
            need.comments = [];
          }
          if(this.trello){
            trelloSvc.addNewComment(this.trello, need, comment).
              then(data => console.log(data))
              .catch(err => console.log(err));
          }
          need.comments.push({
            text: comment,
            time: (new Date()).toJSON(),
            author: User.currentId()
          });
          this.setTimestampAccess('needs', true);
        }

        delete() {
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
                'root.type': 'project',
                'root.title': {$ne: ''}
              }
            },
            {
              $sort: {'root.pad.lastmodtime': -1}
            },
            {
              $skip: options.pagination.pageIndex * options.pagination.pageSize
            },
            {
              $limit: options.pagination.pageSize
            }
          ]
        };

        // all method only list public and user's projects
        query._aggregate[0].$match.$or = [
          // when anonymous user, Users.currentId is undefined
          {'participants': User.currentId() || 'anonymous'},
          {'root.shareMode': 'public'}
        ];

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

        if (options.titleLike) {
          query._aggregate[0].$match['root.title'] = {
            $regex: options.titleLike,
            $options: 'i'
          };
        }

        if (options.featured) {
          query._aggregate[0].$match['root.featured'] = {$exists: true, $ne: 'false'};
          query._aggregate[1].$sort = {'root.featured': -1};
        }

        if (options.latest) {
          query._aggregate[1].$sort = {'_id': -1};
        }

        if (options.projection) {
          query._aggregate.push({
            $project: options.projection
          });
        }

        return query;
      }

      /*
       * Find all the projects that meet some condition
       */
      function all(options) {

        if (!options.pagination) {
          options.pagination = {};
        }

        if (!options.pagination.pageSize) {
          options.pagination.pageSize = 12;
        }

        if (!options.pagination.pageIndex) {
          options.pagination.pageIndex = 0;
        }

        var projects = [],
          query = buildAllQuery(options);

        var nextPage = function () {
          // build a new options parameter for next page
          var nextPageOptions = options;

          nextPageOptions.pagination.pageIndex += 1;

          return all(nextPageOptions);
        };

        var projsPromise = $q(function (resolve, reject) {
          swellRT.query(query, function (result) {

            if (result.length === 0) {
              nextPage = undefined;
            }

            angular.forEach(result.result, function (val) {
                var v = new ProjectReadOnly(val);
                projects.push(v);
              });

            resolve(projects);
          },
            function (error) {
              console.log(error);

              reject([]);
            });
        });

        projsPromise.next = nextPage;

        return projsPromise;
      }

      function contributing(options = {}) {

        if (!SessionSvc.users.loggedIn()) {
          return $q(function (resolve) {
            resolve([]);
          });
        }

        options.contributor = User.currentId();

        return all(options);
      }

      function find(id) {
        var def = $q.defer();

        if (!openedProjects[id]) {
          openedProjects[id] = def.promise;
          swellRT.openModel(id, function (model) {
            $timeout(function () {
              var pr = swellRT.proxy(model, Project);
              def.resolve(pr);
            });
          }, function (error) {
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

        swellRT.createModel(function (model) {
          openedProjects[model.id()] = d.promise;

          SwellRTCommon.makeModelPublic(model);

          var proxyProj;

          $timeout(function () {
            proxyProj = swellRT.proxy(model, Project);
          });

          $timeout(function () {
            proxyProj.type = 'project';
            proxyProj.communities =
              (options.communityId) ? [options.communityId] : [];
            proxyProj.id = model.id();
            proxyProj.title = '';
            proxyProj.chat = [];
            proxyProj.pad = new swellRT.TextObject();
            proxyProj.attachments = {};
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

      function updateTrello() {
        $location.path(localStorage.getItem('projectUrl'));
        let locationSplit = $location.path().split('/');
        let urlId = locationSplit[locationSplit.length - 1];
        let id = base64.urldecode(urlId);
        if (!localStorage.getItem('trelloTeemToken')) return;
        find(id).then((model) => {
          model.trello = {};
          model.trello.token = localStorage.getItem('trelloTeemToken');
          localStorage.removeItem('trelloTeemToken');
          trelloSvc.createTrelloBoard(model).
            then((BoardData) => {
              model.trello.boardId = BoardData.id;
              trelloSvc.createNewList(model.trello).
                then((listData) => {
                  model.trello.listId = listData.id;
                })
                  .catch(err => console.log(err));
            })
              .catch(err => console.error(err));
        });
      }

      var projectListProjection = {
        participants: 1,
        root: {
          title: 1,
          image: 1,
          id: 1,
          _urlId: 1,
          type: 1,
          featured: 1,
          communities: 1,
          pad: {
            lastmodtime: 1
          }
        }
      };

      return {
        all,
        contributing,
        findByUrlId,
        find,
        create,
        projectListProjection,
        updateTrello
      };
    }]);
