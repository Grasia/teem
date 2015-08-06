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
            console.log(result);
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
          window.SwellRT.openModel(id, function(model){
            var pr = swellRT.proxy(model);
            openedCommunities[id] = pr;
            comDef.resolve(openedProjects[id]);
          }, function(error){
            console.log(error);
            comDef.reject(error);
          });
        } else {
          comDef.resolve(openedProjects[id]);
        }

        var allSnapshot = function(){
              var foundProjects = $q.defer();
              SwellRT.query(
                {
                  'root.type': DATATYPES.PROJECT,
                  'root.communities': id,
                  $and: [{
                    $or: [
                      {'root.private': 'false'},
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
                    if (!openedProjects[val.id]){
                      projects.find(base64.encode(val.id)).then(function(model){
                        $timeout(function(){
                          openedProjects[val.id] = model;
                          projDef.resolve(model);
                        });
                      });
                    } else {
                      projDef.resolve(openedProjects[val.id]);
                    }
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
            console.log(p);
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

    var projects = {

      find: function(urlId) {
        var id = base64.decode(urlId);

        def = $q.defer();

        if (!openedProjects[id]) {
          window.SwellRT.openModel(id, function(model){
            var pr = swellRT.proxy(model);
            openedProjects[id] = pr;
            def.resolve(openedProjects[id]);
          }, function(error){
            console.log(error);
            def.reject(error);
          });
        } else {
          def.resolve(openedProjects[id]);
        }
        return def.promise;
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
            proxyProj.contributors = [];
            proxyProj.private = 'false';
            openedProjects[id] = proxyProj;
            callback(proxyProj);
          });
        });
      },

      /* changes the visibility of the project with base64 id 'projId'
         to private if called with true or public if called with false */
      setVisiblility: function(projId, setPrivate){
        projects.find(
          projId,
          function(project){
            project.private = setPrivate.toString();
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

      window.SwellRT.startSession(
        SwellRTConfig.server, userName || SwellRT.user.ANONYMOUS, password || '',
        onSuccess, onError);
    };

    window.onSwellRTReady = function () {
      window.SwellRT.startSession(
        SwellRTConfig.server, SwellRT.user.ANONYMOUS, "",
        function() {
          communities.all();
          def.resolve(SwellRT);
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
