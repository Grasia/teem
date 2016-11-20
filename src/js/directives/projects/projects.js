'use strict';

angular.module('Teem')
  .directive('projects', [ 'SessionSvc', '$location', '$window', '$timeout', function(SessionSvc, $location, $window, $timeout) {
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

            scope.container = attrs.container;
            var overflowLast = 100000;

            scope.scrollFunct = function () {
              $timeout();
                overflowLast =
                element.children(0).children().children().last().offset().top;
            };

            $timeout(function () {
              angular.element(attrs.container).on('scroll', scope.scrollFunct);
            });

            scope.farFromLast = function() {
              return overflowLast > 2 * angular.element($window).height();
            };

      },
      templateUrl: 'projects/projects.html'
    };
  }]);
