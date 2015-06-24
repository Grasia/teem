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
  .factory('pear', ['$rootScope', 'swellRT', '$q', function($rootScope, swellRT, $q) {

    var proxy = {
      model: {}
    };

    var def = $q.defer();

    var communities = {
      all: function() {
        return [
          {
            id: '1',
            name: 'Medialab Prado'
          },
          {
            id: '2',
            name: 'GRASIA'
          },
          {
            id: '3',
            name: 'Nosaltres'
          }
        ];
      },
      find: function(id) {
        return {
          id: id, 
          name: 'Medialab Prado',
          projects: [
            {
              id: '1',
              title: 'Festilab'
            },
            {
              id: '2',
              title: 'Jardineando'
            }

          ]
        };
      },
      create: function(data, callback) {
        callback({
          id: '1',
          name: 'Medialab Prado',
          projects: [
            {
              id: '1',
              title: 'Festilab'
            },
            {
              id: '2',
              title: 'Jardineando'
            }

          ]
        });
      },
      destroy: function(id) {
        return id;
      }
    };

    var projects = {
      all: function() {
        return proxy.model;
      },
      find: function(id) {
        return proxy.model[id];
      },
      create: function(callback) {
        var p = {
          id: Math.random().toString(36).substr(2, 5),
          title: '',
          chat: [],
          pad: new swellRT.TextObject(),
          needs: [],
          promoter: users.current()
        };

        proxy.model[p.id] = p;
        callback(p);
      },
      destroy: function(id) {
        delete proxy.model[id];
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
      proxy.model[projectId].chat.push({
        text: message,
        // TODO change when ready
        standpoint: 'mine',
        who: users.current(),
        time: (new Date()).toJSON()
      });
    };

    window.onSwellRTReady = function (){
      window.SwellRT.startSession(
        SwellRTConfig.server, SwellRTConfig.user, SwellRTConfig.pass,
        function() {
          window.SwellRT.openModel(
            SwellRTConfig.chatpadWaveId,
            function(model) {
              proxy.model = swellRT.proxy(model);
              def.resolve(proxy.model);
            }, function(error){
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
      onLoad: function(f){
        def.promise.then(f);
      }
    };
  }]);
