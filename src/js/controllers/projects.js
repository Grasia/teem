'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the Pear2Pear
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/communities/:comId/projects', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      });
  }])
  .controller('ProjectsCtrl', [
              'SwellRTSession', 'url', '$scope', '$location', '$route', 'time', 'CommunitiesSvc', 'ProjectsSvc', 'ProfilesSvc',
              function (SwellRTSession, url, $scope, $location, $route, time, CommunitiesSvc, ProjectsSvc, ProfilesSvc) {

    $scope.urlId= url.urlId;

    var comUrlId = $route.current.params.comId;

    SwellRTSession.onLoad(function(){
      var com = CommunitiesSvc.find(comUrlId);
      com.then(function(community){
        $scope.community = community;
      });

      // get the count of new edits and chats for a list of projects and store them in the project properties
      function getNewsCounts(projs) {
       angular.forEach(projs, function(proj) {
         ProfilesSvc.current().then(function(prof){
           proj.newMessagesCount = prof.getNewMessagesCount(proj);
           proj.padEditionCount = prof.getPadEditionCount(proj);
         });
       });
      }
      if (isSection('mydoing')) {
        com.then(function(community){
          community.myProjects().then(
            function (projects){
              $scope.projects = projects;
              getNewsCounts($scope.projects);
            });
        });
      } else {
        com.then(function(community){
          community.getProjects().then(
            function (projects){
              $scope.projects = projects;
            });
        });
      }

      $scope.new_ = function () {
        ProjectsSvc.create(function(p) {

          //FIXME model prototype
          $location.path('/communities/' + url.urlId($scope.community.id) + '/projects/' + url.urlId(p.id) + '/pad');
        }, $scope.community.id);
      };
    });

    //FIXME repeated code in ProjectInfoCtrl
    // Refactorize to service
    function section() {
      if ($route.current.params.section) {
        return $route.current.params.section;
      } else {
        return 'crowddoing';
      }
    }

    function isSection(s) {
      return s === section();
    }

    $scope.nav = function(id) {
      return isSection(id) ? 'selected' : '';
    };

    // TODO: repeated code in NavbarTopCtrl
    $scope.shareIcon = function shareIcon(project) {
      switch (project.shareMode) {
        case 'link':
          return 'fa-link';
        case 'public':
          return 'fa-globe';
        default:
          return '';
      }
    };

    $scope.showProject = function(id, tabName) {
      if (section() === 'mydoing') {
        //FIXME model prototype
        $location.path('/communities/' + url.urlId($scope.community.id) + '/projects/' + url.urlId(id) + '/' + (tabName || 'pad'));
      } else {
        $location.path('/communities/' + url.urlId($scope.community.id) + '/projects/' + url.urlId(id));
      }
    };

    // This function should belong to the model
    // In the prototype or something similar
    $scope.progressPercentage = function(project) {
      var size,
          completed = 0;

      if (project.needs === undefined) {
        return 0;
      }

      size = project.needs.length;

      if (size === 0) {
        return 0;
      }

      angular.forEach(project.needs, function(need) {
        if (need.completed === 'true') {
          completed++;
        }
      });

      return completed * 100 / size;
    };

    $scope.progressType = function(project) {
      var percentage = $scope.progressPercentage(project);

      if (percentage < 33) {
        return 'danger';
      } else if (percentage > 66) {
        return 'success';
      } else {
        return 'warning';
      }
    };

    $scope.supporterCount = function(project) {
      // Migrate project.support
      return project.supporters.length;
    };

    $scope.newMessagesCount = function(project) {
      return project.newMessagesCount;
    };

    $scope.padEditionCount = function(project) {
      return project.padEditionCount;
    };

    $scope.hour = function(msg) {
      return time.hour(new Date(msg.time));
    };

    var lastChatsCache = [];

    $scope.lastChat = function(project){
      if ($scope.newMessagesCount(project) > 0){
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
            time: $scope.hour(lastChat),
            text: lastChat.text,
            isNotification: lastChat.standpoint === 'notification',
            translateValues: lastChat.translateValues
          };
        }
        return lastChatsCache[project.id];
      }
      return undefined;
    };

    $scope.emptyProjects = function(){
      return $scope.projects && (Object.keys($scope.projects).length === 0);
    };

    $scope.projectsUrl = function(communityId){
      if (communityId) {
        return '#/communities/' + $scope.urlId(communityId) + '/projects';
      } else {
        return '#/communities';
      }
    };

    $scope.editor = {
      editting: false
    };
  }]);
