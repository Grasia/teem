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
              'pear', '$scope', '$location', '$route',
              function (pear, $scope, $location, $route) {

    $scope.urlId= pear.urlId;

    var comUrlId = $route.current.params.comId;

    pear.onLoad(function(){
      var com = pear.communities.find(comUrlId);
      com.community.then(function(community){
        $scope.community = community;
      });

      // get the count of new edits and chats for a list of projects and store them in the project properties
      function getNewsCounts(projs) {
       angular.forEach(projs, function(proj) {
         pear.newMessagesCount(proj).then(function(count) {
           proj.newMessagesCount = count;
         });
         pear.padEditionCount(proj).then(function(count) {
           proj.padEditionCount = count;
         });
       });
      }
      if (isSection('mydoing')) {
        pear.projects.myProjects(comUrlId).then(
          function (projects){
            $scope.projects = projects;
            getNewsCounts($scope.projects);
          });
      } else {
        com.projects.all().then(
          function (projects){
            $scope.projects = projects;
          });
      }

      $scope.new_ = function () {
        pear.projects.create(function(p) {

          //FIXME model prototype
          $location.path('/communities/' + pear.urlId($scope.community.id) + '/projects/' + pear.urlId(p.id) + '/pad');
        }, $scope.community.id);
      };
      $scope.destroy = function() {
        pear.communities.destroy(pear.urlId($scope.community.id));

        $location.path('/communities');
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
        $location.path('/communities/' + pear.urlId($scope.community.id) + '/projects/' + pear.urlId(id) + '/' + (tabName || 'pad'));
      } else {
        $location.path('/communities/' + pear.urlId($scope.community.id) + '/projects/' + pear.urlId(id));
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

    // TODO avoid repetition of this code: reapeated in chat.js
    $scope.hour = function(msg) {
      var d = (new Date(msg.time));

      return d.getHours() + ':' + (d.getMinutes()<10?'0':'') + d.getMinutes();
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

  }]);
