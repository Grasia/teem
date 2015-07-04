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
  .factory('pear', ['$rootScope', 'swellRT', '$q', '$timeout', function($rootScope, swellRT, $q, $timeout) {

    var proxy = {
      communities: {}
    };

    // map of opened projects
    var openedProjects = {};

    var def = $q.defer();

    var communities = {

      all: function() {
        return proxy.communities;
      },

      find: function(id) {
        var community = proxy.communities[id];
        return {
          community: community,
          projects: {
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
          }
        };
      },
      create: function(data, callback) {
        var id = window.SwellRT.createModel(function(model){
          var p = swellRT.proxy(model);
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
      destroy: function(id) {
        delete proxy.communities[id];
        return id;
      }
    };

    var projects = {

      find: function(id) {
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
          var p = {
            proj : {}
          };
          proxy.proj = swellRT.proxy(model);
          $timeout(function(){
            proxy.proj['id'] = id;
            proxy.proj['title'] = '';
            proxy.proj['chat'] = [];
            proxy.proj['pad'] = new swellRT.TextObject();
            proxy.proj['needs'] = [];
            proxy.proj['promoter'] = users.current();
            openedProjects[id] = proxy.proj;
            callback(proxy.proj);
          });
        });
      }
    };

    var users = {
      current: function() {
        return window.sessionStorage.getItem('userId');
      },
      setCurrent: function() {
      },
      isCurrent: function(user) {
        return user === users.current();
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

    window.onSwellRTReady = function () {
      window.SwellRT.startSession(
        SwellRTConfig.server, SwellRTConfig.user, SwellRTConfig.pass,
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
    };

    if (window.SwellRT) {
      window.onSwellRTReady();
    }

    return {
      communities: communities,
      projects: projects,
      users: users,
      addChatMessage: addChatMessage,
      onLoad: function(f) {
        def.promise.then(f);
      }
    };
  }]);
