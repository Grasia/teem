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
           '$rootScope', 'swellRT', '$q', '$timeout', 'base64', 'loading',
           function($rootScope, swellRT, $q, $timeout, base64, loading) {

    var proxy = {
    };

    // FIXME model prototype
    var urlId = function(id) {
      if (id === undefined) { return ''; }

      return base64.urlencode(id);
    };

    // map of opened projects
    var openedProjects = {};
    // map of opened communities
    var openedCommunities = {};
    // map of opened profiles
    var openedProfiles = {};
    // map of created profiles
    var createdProfiles = {};

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
        loading.show();

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

            loading.hide();
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

            loading.hide();
          }
        );

        queries.then(function(){
          angular.forEach(nums, function(val){
            comms[val._id].numProjects = val.number;
          });

          communities.resolve(comms);

          loading.hide();
        });

        return communities.promise;
      },

      find: function(urlId) {
        loading.show();

        var id = base64.urldecode(urlId);
        var comDef = $q.defer();
        var community = comDef.promise;

        if (!openedCommunities[id]) {
          openedCommunities[id] = comDef.promise;

          window.SwellRT.openModel(id, function(model){
            var pr = swellRT.proxy(model);

            comDef.resolve(pr);

            loading.hide();
          }, function(error){
            console.log(error);

            comDef.reject(error);

            loading.hide();
          });
        } else {
          openedCommunities[id].then(
            function(r){
              comDef.resolve(r);

              loading.hide();
            });
        }

        var allSnapshot = function(){
          loading.show();

              var foundProjects = $q.defer();
              SwellRT.query(
                {
                  'root.type': 'project',
                  'root.communities': id,
                  'root.shareMode': 'public'
                },
                function(result){
                  var projs = [];
                  angular.forEach(result.result, function(val) {
                    projs.push(val.root);
                  });
                 foundProjects.resolve(projs);

                 loading.hide();
                },
                function(e){
                  foundProjects.reject(e);

                  loading.hide();
                }
              );
              return foundProjects.promise;
      };

      return {
          community: comDef.promise,
          projects: {

            allSnapshot: allSnapshot,

            all: function() {
              // Need to refactor this as query
              // loading.show();

              var projsDef = $q.defer();
              allSnapshot().then(function(all){
                var promises = {};
                if (all.length > 0){
                  angular.forEach(all, function(val){
                    var projDef = $q.defer();
                    promises[val.id] = projDef.promise;
                    projects.find(base64.urlencode(val.id)).then(function(model){
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
          loading.show();

          makeModelPublic(model);
          var p = swellRT.proxy(model);

          $timeout(function(){
            p.type = 'community';
            p.name = data.name;
            p.id = id;
            p.projects = [];

            loading.hide();

            callback(p);
          });
        });
      },
      destroy: function(urlId) {
          var id = base64.urldecode(urlId);
        // currently not supported by SwellRT
        return urlId;
      },

      setCurrent: function(communityId) {
        return window.localStorage.setItem('communityId', communityId);
      },

      myCommunities: function(){
        var myComms = $q.defer();
        SwellRT.query(
          {
            _aggregate : [
              {$match: {
                'root.type': 'project',
                'root.contributors': users.current()
              }},
              {$unwind: '$root.communities'},
              {$group :
               {_id:'$root.communities'
               }
            }]
          },
          function(result){
            var comms = [];

            angular.forEach(result.result, function(val) {
              comms.push(val._id);
            });

            SwellRT.query(
              {
                'root.type': 'community',
                'root.id' : {
                  $in : comms
                }
              },
              function(result){
                var resultComms = {};

                angular.forEach(result.result, function(val){
                  resultComms[val.root.id] = val.root;
                });

                myComms.resolve(resultComms);
              },
              function(error){
                myComms.reject(error);
              }
            );
          },
          function(error){
            myComms.reject(error);
          }
        );
        return myComms.promise;
      },

      current: function() {
        return window.localStorage.getItem('communityId');
      }
    };

    var findProjects = function(urlId) {
      loading.show();

        var id = base64.urldecode(urlId);
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

              loading.hide();
            });
        }
        return def.promise;
    };
    var projects = {

      find: findProjects,

      create: function(callback, communityId) {
        loading.show();

        var id = window.SwellRT.createModel(function(model){

          makeModelPublic(model);
          var proxyProj = swellRT.proxy(model);
          $timeout(function(){
            proxyProj.type = 'project';
            proxyProj.communities = (communityId) ? [communityId] : [];
            proxyProj.id = id;
            proxyProj.title = '';
            proxyProj.chat = [];
            proxyProj.pad = new swellRT.TextObject();
            proxyProj.needs = [];
            proxyProj.promoter = users.current();
            proxyProj.supporters = [];
            proxyProj.contributors = [users.current()];
            proxyProj.shareMode = 'link';
            var d = $q.defer();
            d.resolve(proxyProj);
            openedProjects[id] = d.promise;

            loading.hide();

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

        projects.find(projId).then(
          function(p){
            if (user && p.contributors.indexOf(user) < 0){
              p.contributors.push(user);
            }
          });
      },
      myProjects: function(communityId){

        var myProjs = $q.defer();

        var query = {
          _aggregate: [
            {
              $match: {
                'root.type': 'project',
                'root.contributors': users.current()
              }
            }
          ]};

        if (communityId){
          query._aggregate[0].$match['root.communities'] = base64.urldecode(communityId);
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
      }
    };

    var users = {
      password: '$password$',
      current: function() {
        return window.localStorage.getItem('userId');
      },
      setCurrent: function(name) {
        var cleanedName = name ? name.trim() : name;

        return window.localStorage.setItem('userId', cleanedName);
      },
      isCurrent: function(user) {
        return user === users.current();
      },
      loggedIn: function() {
        return users.current() !== 'undefined' && users.current() !== null;
      },
      clearCurrent: function(){
        window.localStorage.removeItem("userId");
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

    var addChatNotification = function(projectId, message, translateValues) {
      projects.find(projectId).then(function(project){
        project.chat.push({
          text: message,
          time: (new Date()).toJSON(),
          standpoint: 'notification',
          translateValues: translateValues
        });
      }, function(error){
        console.log(error);
      });
    };

    var toggleSupport = function(projectId) {
      projects.find(base64.urlencode(projectId)).then(
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

    var addNeedComment = function(need, comment){
      if (!need.comments){
        need.comments = [];
      }
      need.comments.push({
        text: comment,
        time: (new Date()).toJSON(),
        author: users.current()
      });
    };

    var registerUser = function(userName, password, onSuccess, onError){
      window.SwellRT.registerUser(SwellRTConfig.server, userName, password, onSuccess, onError);
    };
    var startSession = function(userName, password, onSuccess, onError){
      loading.show();

      // TODO: do not try to close when no other session is open
      try{
        window.SwellRT.stopSession();
      } catch(e) {}

      window.SwellRT.startSession(
        SwellRTConfig.server, userName || SwellRT.user.ANONYMOUS, password || '',
        function(){
          SwellRTConfig.swellrtServerDomain = __session.domain;
          if (userName){
            users.setCurrent(__session.address);
          } else {
            users.clearCurrent();
          }
          SwellRT.on(SwellRT.events.NETWORK_CONNECTED, onSuccess);

          loading.hide();
        }, function() {
          onError();
          loading.hide();
        });
    };

    // check that the profile does not exists before calling this method
    var createProfile = function(userName) {
      if (!createdProfiles[userName]) {
        var def = $q.defer();
        createdProfiles[userName] = def.promise;
        window.SwellRT.createModel(
          function(model) {
            var proxy = swellRT.proxy(model);
            $timeout(function(){
              proxy.type = "userProfile";
              proxy.userName = userName;
              proxy.lastProjectVisit = {};
              def.resolve(proxy);
            });
          });
      }
      return createdProfiles[userName];
    };

    var getProfile = function(userName) {

      if (!openedProfiles[userName]){
        var def = $q.defer();
        openedProfiles[userName] = def.promise;
        window.SwellRT.query(
          {
            'root.type' : 'userProfile',
            'root.userName' : userName
          }, function(result) {
            // check that there is one and only one profile for the user
            if (result.result.length < 1) {
              def.reject('Profile not found');
              return;
            } else if (result.result.length > 1) {
              def.reject('ERROR: More than one profile found for user ', userName);
              return;
            }
            window.SwellRT.openModel(result.result[0].wave_id,
              function(model) {
                var proxy = swellRT.proxy(model);

                $timeout(function(){
                  def.resolve(proxy);
                });
              },
              function(error){
                def.reject(error);
              }
            );
          }
        );
      }
      return openedProfiles[userName];
    };

    var getOrCreateProfile = function(){
      var profileDef = $q.defer();
      getProfile(users.current()).then(
        function(prof){
          profileDef.resolve(prof);
        }, function(error) {
          if (error === 'Profile not found'){
            createProfile(users.current()).then(
              function(p) {
                profileDef.resolve(p);
              },
              function(error){
                profileDef.reject(error);
              }
            );
          }
        });
      return profileDef.promise;
    };

    var newMessagesCount = function(project){
      var countDef = $q.defer();

      getOrCreateProfile().then(
        function(profile) {
          if (!profile.lastProjectVisit){
            profile.lastProjectVisit = {};
          }
          var lastVisit =
            (profile.lastProjectVisit[project.id])?
            new Date(profile.lastProjectVisit[project.id]):new Date(0);

          var chatsLength = project.chat.length;

          if (chatsLength > 0){
            var i = chatsLength - 1;
            while (i > -1 && (new Date(project.chat[i].time) > lastVisit)) {
              i --;
            }
            countDef.resolve(chatsLength - 1 - i);
          } else {
            countDef.resolve(0);
          }
        },
      function(error){
        console.log(error);
      });
      return countDef.promise;
    };

    var padEditionCount = function(project){
      var countDef = $q.defer();
      getOrCreateProfile().then(function(profile){

        var lastVisit =
          (profile.lastProjectVisit[project.id])?
          new Date(profile.lastProjectVisit[project.id]):new Date(0);

        if (project.pad.lastmodtime < lastVisit.getTime()){
          countDef.resolve(0);
          }
        else {
          // TODO return real number of changes when available
          countDef.resolve(1);
        }
      }, function(error){
        countDef.reject(error);
      });
      return countDef.promise;
    };

    var timestampProjectAccess = function(projId){
      getProfile(users.current()).then(function(profile) {
        var decodedId = base64.urldecode(projId);
        $timeout(function(){
          profile.lastProjectVisit[decodedId] = (new Date()).toJSON();
        });
      });
    };

    window.onSwellRTReady = function () {
      var user = undefined,
          pass = undefined;

      if (users.current() != null) {
        user = users.current();
        pass = users.password;
      }

      startSession(user, pass, function(){
          $timeout(
            function() {
              communities.all();
              def.resolve(SwellRT);

              loading.hide();
            });
        },
        function(error) {
          console.log(error);

          loading.hide();
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
      addChatNotification: addChatNotification,
      addNeedComment: addNeedComment,
      toggleSupport: toggleSupport,
      startSession: startSession,
      registerUser: registerUser,
      newMessagesCount: newMessagesCount,
      padEditionCount: padEditionCount,
      timestampProjectAccess: timestampProjectAccess,
      onLoad: function(f) {
        def.promise.then(f);
      }
    };
  }]);
