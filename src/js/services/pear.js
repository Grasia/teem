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
      communities: {}
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

    var def = $q.defer();

    var communities = {

      all: function() {
        return proxy.communities;
      },

      find: function(urlId) {
        var id = base64.decode(urlId);
        var community = proxy.communities[id];
        var allSnapshot = function(){
              var foundProjects = $q.defer();
              SwellRT.query(
                {
                  'root.type': DATATYPES.PROJECT,
                  'root.communities': id,
                  $or: [
                    {'root.private': 'false'},
                    {'root.supporters': users.current()},
                    {'root.contributors': users.current()}
                  ]
                },
                function(result){
                  console.log(JSON.stringify(result));
                  var projs = [];
                  angular.forEach(result.result, function(val) {
                    console.log(val.root);
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
          community: community,
          projects: {

            allSnapshot: allSnapshot,

            all: function() {
              var projsDef = $q.defer();
              allSnapshot().then(function(all){
                var promises = {};
                if (all.length > 0){
                  angular.forEach(all, function(val){
                    var projDef = $q.defer();
                    console.log(val);
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
                } else projsDef.resolve([]);
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
          var p = swellRT.proxy(model);
          p.type = DATATYPES.COMMUNITY;
          p.name = data.name;
          p.id = id;
          p.projects = [];
          proxy.communities[id] = p;
          callback({
            community: p,
            projects: {
              // TODO avoid repeated function
              all: function() {
                var promises = {};
                angular.forEach(community.projects, function(val){
                  var projDef = $q.defer();
                  promises[val] = projDef.promise;
                  if (!openedProjects[val]){
                    window.SwellRT.openModel(val, function(model){
                      $timeout(function(){
                        var pr = swellRT.proxy(model);
                        openedProjects[val] = pr;
                        projDef.resolve(pr);
                      });
                    });
                  } else {
                    projDef.resolve(openedProjects[val]);
                  }
                });

                var projsDef = $q.all(promises);
                return projsDef;
              }
            }});
        });
      },
      destroy: function(urlId) {
        var id = base64.decode(urlId);

        delete proxy.communities[id];

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
            def.reject(error);
          });
        } else {
          def.resolve(openedProjects[id]);
        }
        return def.promise;
      },
      create: function(callback) {
        var id = window.SwellRT.createModel(function(model){

          model.addParticipant('@' + SwellRTConfig.waveServerDomain,
                                null,
                                function(err){
                                  console.log('ERROR: ' + err);
                                }
                              );

          proxy.proj = swellRT.proxy(model);
          $timeout(function(){
            proxy.proj.type = DATATYPES.PROJECT;
            proxy.proj.communities = (communityId) ? [communityId] : [];
            proxy.proj.id = id;
            proxy.proj.title = '';
            proxy.proj.chat = [];
            proxy.proj.pad = new swellRT.TextObject();
            proxy.proj.needs = [];
            proxy.proj.promoter = users.current();
            proxy.proj.supporters = [];
            proxy.proj.contributors = [];
            proxy.proj.private = 'false';
            openedProjects[id] = proxy.proj;
            callback(proxy.proj);
          });
        });
      },

      /* changes the visibility of the project with base64 id 'projId'
         to private if called with true or public if called with false */
      setVisiblility: function(projId, setPrivate){
        project.find(
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
      console.log(projectId);
      projects.find(base64.encode(projectId)).then(
        function(model){
          console.log(model);
          var index = model.supporters.indexOf(users.current());

          $timeout(function(){
            if (index > -1) {
              model.supporters.splice(index, 1);
            } else {
              model.supporters.push(users.current());
              console.log(model.supporters);
            }
          });
        },
        function(error){
          console.log(error);
        }
      );
    };

    window.onSwellRTReady = function () {
      window.SwellRT.startSession(
        "http://demo.swellrt.org", SwellRT.user.ANONYMOUS, "",
        function() {
          // Open Community List
          window.SwellRT.openModel(
            SwellRTConfig.communityListWaveId,
            function(model) {
              proxy.communities = swellRT.proxy(model);
              if (!proxy.communities){
                proxy['communities'] = {};
              }
              def.resolve(proxy.model);
            },
            function(error){
              console.log(error);
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
      onLoad: function(f) {
        def.promise.then(f);
      }
    };
  }]);
