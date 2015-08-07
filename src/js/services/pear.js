'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.service:Pear
 * @description
 * # Pear service
 * Provides controllers with a data model for pear to pear app
 * It serves as an abstraction between Pear data and backend (SwellRT)
 */

angular.module('Pear2Pear')
  .factory('pear', [
           '$rootScope', 'swellRT', '$q', '$timeout', 'base64',
           function($rootScope, swellRT, $q, $timeout, base64) {

    var proxy = {
    };

    var DATATYPES = {
      PROJECT: 'PROJECT',
      COMMUNITY: 'COMMUNITY'
    };

    // FIXME model prototype
    var urlId = function(id) {
      if (id === undefined) { return ''; }

      return base64.encode(id);
    };

    // map of opened projects
    var openedProjects = {};
    // map of opened communities
    var openedCommunities = {};

    var def = $q.defer();

    function makeModelPublic(model){
      model.addParticipant('@' + SwellRTConfig.swellrtServerDomain,
                           null,
                           function(err){
                             console.log('ERROR: ' + err);
                           }
                          );
    }

    var communities = {

      all: function() {
        var foundCommunities = $q.defer();
        SwellRT.query(
          {
            'root.type': DATATYPES.COMMUNITY
          },
          function(result){
            var comms = [];
            angular.forEach(result.result, function(val) {
              comms.push(val.root);
            });
            foundCommunities.resolve(comms);
          },
          function(e){
            foundCommunities.reject(e);
          }
        );
        return foundCommunities.promise;
      },

      find: function(urlId) {

        var id = base64.decode(urlId);
        var comDef = $q.defer();
        var community = comDef.promise;

        if (!openedCommunities[id]) {
          openedCommunities[id] = comDef.promise;
          window.SwellRT.openModel(id, function(model){
            var pr = swellRT.proxy(model);
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

        var allSnapshot = function(){
              var foundProjects = $q.defer();
              SwellRT.query(
                {
                  'root.type': DATATYPES.PROJECT,
                  'root.communities': id,
                  $and: [{
                    $or: [
                      {'root.shareMode': projects.shareMode.PUBLIC},
                      {'root.supporters': users.current()},
                      {'root.contributors': users.current()}
                    ]
                  }]
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
      return {
          community: comDef.promise,
          projects: {

            allSnapshot: allSnapshot,

            all: function() {
              var projsDef = $q.defer();
              allSnapshot().then(function(all){
                var promises = {};
                if (all.length > 0){
                  angular.forEach(all, function(val){
                    var projDef = $q.defer();
                    promises[val.id] = projDef.promise;
                    projects.find(base64.encode(val.id)).then(function(model){
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
            },
            destroy: function(projId){
              var i = community.projects.indexOf(projId);
              if (i > -1){
                community.projects.splice(i,1);
              }
            }
          }
        };
      },
      create: function(data, callback) {
        var id = window.SwellRT.createModel(function(model){

          makeModelPublic(model);
          var p = swellRT.proxy(model);

          $timeout(function(){
            p.type = DATATYPES.COMMUNITY;
            p.name = data.name;
            p.id = id;
            p.projects = [];
            callback(p);
          });
        });
      },
      destroy: function(urlId) {
        var id = base64.decode(urlId);
        // currently not supported by SwellRT
        return urlId;
      }
    };

    var findProjects = function(urlId) {
        var id = base64.decode(urlId);
        var def = $q.defer();
        if (!openedProjects[id]) {
          openedProjects[id] = def.promise;
          window.SwellRT.openModel(id, function(model){
            var pr = swellRT.proxy(model);
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
    var projects = {

      find: findProjects,

      shareMode : {
        'PUBLIC': 'PUBLIC',
        'LINK': 'LINK',
        'INVITE': 'INVITE'
      },

      create: function(callback, communityId) {
        var id = window.SwellRT.createModel(function(model){

          makeModelPublic(model);
          var proxyProj = swellRT.proxy(model);
          $timeout(function(){
            proxyProj.type = DATATYPES.PROJECT;
            proxyProj.communities = (communityId) ? [communityId] : [];
            proxyProj.id = id;
            proxyProj.title = '';
            proxyProj.chat = [];
            proxyProj.pad = new swellRT.TextObject();
            proxyProj.needs = [];
            proxyProj.promoter = users.current();
            proxyProj.supporters = [];
            proxyProj.contributors = [users.current()];
            proxyProj.shareMode = projects.shareMode.LINK;
            var d = $q.defer();
            d.resolve(proxyProj);
            openedProjects[id] = d.promise;
            callback(proxyProj);
          });
        });
      },

      setShareMode: function(projId, shareMode){
        projects.find(projId).then(
          function(project){
            $timeout(function(){
              project.shareMode = shareMode;
            });
          }
        );
      },

      addContributor: function(projId, user){
        if (!user){
          user = users.current();
        }
        console.log('user',user);
        projects.find(projId).then(
          function(p){
            if (user && p.contributors.indexOf(user) < 0){
              p.contributors.push(user);
            }
          });
      }
    };

    var users = {
      current: function() {
        return window.sessionStorage.getItem('userId');
      },
      setCurrent: function(name) {
        var cleanedName = name ? name.trim() : name;

        return window.sessionStorage.setItem('userId', cleanedName);
      },
      isCurrent: function(user) {
        return user === users.current();
      },
      loggedIn: function() {
        return users.current() !== 'undefined' && users.current() !== null;
      }
    };

    var addChatMessage = function(projectId, message) {
      projects.find(projectId).then(function(project){
        project.chat.push({
          text: message,
          who: users.current(),
          time: (new Date()).toJSON()
        });
        projects.addContributor(projectId);
      }, function(error){
        console.log(error);
      });
    };

    var toggleSupport = function(projectId) {
      projects.find(base64.encode(projectId)).then(
        function(model){
          var index = model.supporters.indexOf(users.current());

          $timeout(function(){
            if (index > -1) {
              model.supporters.splice(index, 1);
            } else {
              model.supporters.push(users.current());
            }
          });
        },
        function(error){
          console.log(error);
        }
      );
    };

    var registerUser = function(userName, password, onSuccess, onError){
      window.SwellRT.registerUser(SwellRTConfig.server, userName, password, onSuccess, onError);
    };

    var startSession = function(userName, password, onSuccess, onError){

      // if login with user Name, close previous anonimous session
      if (userName){
        window.SwellRT.stopSession();
      }
      window.SwellRT.startSession(
        SwellRTConfig.server, userName || SwellRT.user.ANONYMOUS, password || '',
        function(){
          SwellRT.on(SwellRT.events.NETWORK_CONNECTED, onSuccess);
        }, onError);
    };

    window.onSwellRTReady = function () {
      startSession(null, null, function(){
          $timeout(
            function() {
              communities.all();
              def.resolve(SwellRT);
            });
        },
        function(error) {
          console.log(error);
        });
      // to avoid multiple calls
      window.onSwellRTReady = null;
    };

    if (window.SwellRT && typeof window.onSwellRTReady === 'function') {
      window.onSwellRTReady();
    }

    return {
      communities: communities,
      projects: projects,
      users: users,
      urlId: urlId,
      addChatMessage: addChatMessage,
      toggleSupport: toggleSupport,
      startSession: startSession,
      registerUser: registerUser,
      onLoad: function(f) {
        def.promise.then(f);
      }
    };
  }]);
