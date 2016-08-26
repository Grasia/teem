'use strict';

angular.module('Teem')
  .directive('projects', [ 'SessionSvc', '$location', function(SessionSvc, $location) {
    return {

      link: function (scope, element, attrs) {

        scope.container = attrs.container;

            scope.showProject = function(project, tab = 'pad') {
              $location.path(project.path()).search('tab', tab);
            };

            var lastChatsCache = [];

            scope.lastChat = function(project){
              if (project.newMessagesCount(project) > 0){
                if (!lastChatsCache[project.id] || lastChatsCache[project.id].index !== project.chat.length-1) {
                  var lastChat = project.chat[project.chat.length-1];
                  lastChatsCache[project.id] = {
                    index: project.chat.length-1,
                    who: lastChat.who,
                    author: function() {
                      if (!lastChat) {
                        return '';
                      }
                      return lastChat.who.split('@')[0] + ':';
                    },
                    time: scope.hour(lastChat),
                    text: lastChat.text,
                    isNotification: lastChat.standpoint === 'notification',
                    translateValues: lastChat.translateValues
                  };
                }
                return lastChatsCache[project.id];
              }
              return undefined;
            };

            scope.emptyProjects = function(){
              return scope.projects && (Object.keys(scope.projects).length === 0);
            };
      },
      templateUrl: 'projects/projects.html'
    };
  }]);
