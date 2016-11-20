'use strict';

angular.module('Teem')
  .directive('projects', [ 'SessionSvc', '$location', '$window', '$timeout', '$rootScope', function(SessionSvc, $location, $window, $timeout, $rootScope) {
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
            scope.overflowLast = 100000;

            var scrolling = false;


            scope.scrollFunct = function () {
              function updateOverflow() {
                scope.overflowLast =
                element.children(0).children().children().last().offset().top;
                scope.farFromLast = scope.overflowLast > 2 * angular.element($window).height();
                $rootScope.$broadcast('overflowUpdated');
              }
                if (!scrolling){
                  scrolling = true;
                  updateOverflow();

                  $timeout(function () {
                    updateOverflow();
                    scrolling = false;
                  }, 200);
                }
            };

            $timeout(function () {
              angular.element(attrs.container).on('scroll',
                scope.scrollFunct
              );
            }, 100);

      },
      templateUrl: 'projects/projects.html'
    };
  }]);
