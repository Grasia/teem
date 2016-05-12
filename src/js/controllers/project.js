
'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the Teem
 */

angular.module('Teem')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      // Transition from old paths
      .when('/projects/:id/:new?', {
        redirectTo: function(params) {
          return '/teems/' + params.id;
        }
      })
      .when('/teems/:id/:new?', {
        templateUrl: 'projects/project.html',
        controller: 'ProjectCtrl',
        // Change between tabs without re-rendering the view
        reloadOnSearch: false
      })
      // Getting a project from projects widget
      .when('/communities/:communityId/teems/fetch/:id', {
        controller: 'FetchProject'
      })
      // Old stuff
      .when('/communities/:communityId/teems/:id', {
        redirectTo: function(params) {
          return '/teems/' + params.id;
        }
      })
      .when('/communities/:communityId/teems/:id/:tab', {
        redirectTo: function(params) {
          return '/teems/' + params.id + '?tab=' + params.tab;
        }
      });
  }])
  .controller('FetchProject', [
  'ProjectsSvc', 'Url', '$route', '$location',
  function(ProjectsSvc, Url, $route, $location) {
    var communityId = Url.decode($route.current.params.communityId),
        localId     = $route.current.params.id;

    ProjectsSvc.all({
      community: communityId,
      localId: localId
    }).then(function(projects) {
      var project = projects[0];

      if (project) {
        $location.path(project.path());
        return;
      }

      ProjectsSvc.create({
        communityId:  communityId
      }).then(function(project) {
        project.localId = localId;

        $location.path(project.path());
      });
    });
  }])
  .controller('ProjectCtrl', [
  'SessionSvc', '$scope', '$rootScope', '$location', '$route', '$timeout', 'swellRT',
  'SharedState', 'ProjectsSvc', 'Loading', '$window', 'NewForm', 'CommunitiesSvc', 'User',
  function (SessionSvc, $scope, $rootScope, $location, $route, $timeout, swellRT,
  SharedState, ProjectsSvc, Loading, $window, NewForm, CommunitiesSvc, User) {

    var editingTitle = false;

    $scope.invite = {
      list : [],
      selected : []
    };

    function buildInviteItems(items){
      var res = [];
      items.forEach(function(i){
        var nick = i._id.split('@')[0];
        if (nick !== ''){
          res.push({
            _id: i._id,
            nick: i._id.split('@')[0]
          });
        }
      });

      return res;
    }
    /* Populates the user selector witht the users that participate in the community
     * or co-contributors if there are no communities
     */
    $scope.populateUserSelector = function() {

      if ($scope.project.communities.length > 0){
        CommunitiesSvc.communitiesContributors(
          $scope.project.communities
        ).then(function(result){
          $scope.invite.list.push(buildInviteItems(result));
        });
      } else {
        User.coContributors().then(function(r){
          $scope.invite.list.push(buildInviteItems(r));
        });
      }
    };

    SessionSvc.onLoad(function(){
      Loading.show(ProjectsSvc.findByUrlId($route.current.params.id)).
        then(function(project) {
          $scope.project = project;
          $scope.populateUserSelector();

          $rootScope.og = {
            title: project.title,
            description: project.pad.text().substring(0, 200),
            url: project.url(),
            image: project.logoUrl()
          };

          if($location.search().tab === 'chat' && !$scope.project.isParticipant()){
            SharedState.setOne('projectTab', 'pad');
          }

          CommunitiesSvc.all({ ids: project.communities }).then(function (communities) {
            $timeout(function() {
              $scope.communities = communities;
            });
          });
        });
    });

    function currentTab() {
      return $location.search().tab || 'pad';
    }

    SharedState.initialize($scope, 'projectTab', {
      defaultValue: currentTab()
    });

    function swipeToProjectTab(tab) {
      return function(event) {
        if (event.pointerType === 'touch') {
          SharedState.set('projectTab', tab);
        }
      };
    }

    $scope.swipeToPad = swipeToProjectTab('pad');
    $scope.swipeToNeeds = swipeToProjectTab('needs');
    $scope.swipeToChat = swipeToProjectTab('chat');

    $scope.hmManagerOpt = '{"cssProps": {"userSelect": true}}';
    $scope.hmRecognizerOpt = '{"threshold": 200}';


    SharedState.initialize($scope, 'hiddenTabs');
    $scope.areTabsHidden = function() {
      return SharedState.isActive('hiddenTabs') && $window.innerHeight < 400;
    };

    NewForm.initialize($scope, 'project');

    $scope.uploadProjectPhoto = function(file) {
      $scope.project.image = new swellRT.FileObject(file);
    };

    $scope.editingTitle = function() {
      return editingTitle || $scope.isNew();
    };

    $scope.showEditTitle = function() {
      editingTitle = true;
    };

    $scope.hideEditTitle = function() {
      editingTitle = false;
    };

    $scope.titleReminder = function titleReminder() {
      SharedState.turnOff('projectTitleReminder');
      $scope.showEditTitle();
      $timeout(function(){
        document.querySelector('.title-input').focus();
      });
    };

    $scope.$on('mobile-angular-ui.state.changed.projectTab', function(e, newVal, oldVal) {
      $scope.project.setTimestampAccess(oldVal);
      $scope.project.setTimestampAccess(newVal);

      $location.search({ tab: newVal});
    });

    $scope.$on('$routeChangeStart', function(event, next, current) {
      if (current.params.tab !== undefined) {
        $scope.project.setTimestampAccess(current.params.tab);
      }
    });

    $scope.cancelProject = function() {
      SharedState.turnOff('projectTitleReminder');

      $scope.project.delete();

      $location.path('/');
    };

    $scope.hasChanged = function(section){

      if(!$scope.project || ! $scope.project.lastChange(section) ||
        !$scope.project.isParticipant()){
        return false;
      }

      var lastChange = $scope.project.lastChange(section);
      var lastAccess;
          if ($scope.project.getTimestampAccess() &&
            $scope.project.getTimestampAccess()[section]) {
            lastAccess = new Date(($scope.project.getTimestampAccess()[section]).last);
          } else {
            lastAccess = new Date(0);
          }
      return lastChange > lastAccess;
    };

    $scope.communitySelector = {
      options: [],
      config: {
        create: false,
        valueField: 'id',
        labelField: 'name',
        searchField: 'name',
        onChange: function(ids) {
          $scope.communities = $scope.communitySelector.options.filter(community => ids.includes(community.id));
          $scope.populateUserSelector();
        },
        plugins: ['remove_button']
      }
    };
    SessionSvc.onLoad(function() {
      CommunitiesSvc.participating({ projectCount: true }).then(function(communities){
        $scope.communitySelector.options = angular.extend([], $scope.communities, communities);
      });
    });

    $scope.selectizeConfig = {
      plugins: ['remove_button'],
      valueField:'_id',
      labelField:'nick',
      searchField:'nick',
      autocapitalize: 'off',
      load: function(query, callback){
        if (!query.length) {
          return callback();
        }
        User.usersLike(query)
          .then(function(r){
            callback(buildInviteItems(r));
            $timeout();
          }, function(){
            callback();
            $timeout();
          });
      },
      //code based on https://selectize.github.io/selectize.js/ email example
      createFilter: function(input){
        var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
          '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

          var match, regex;

        regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
        match = input.match(regex);
        if (match){
          return !this.options.hasOwnProperty(match[0]);
        }
        return false;
      },
      //code based on https://selectize.github.io/selectize.js/ email example
      create: function(input){
        console.log(input);
        return {
          nick: input,
          _id: JSON.stringify({
            email: input
          })
        };
      }

    };
    // Do not leave pad without giving a title to the project
    $rootScope.$on('$routeChangeStart', function(event) {
      if ($scope.project.type !== 'deleted' && ($scope.project.title === undefined || $scope.project.title === '')) {
        event.preventDefault();

        SharedState.turnOn('projectTitleReminder');
      }
    });
  }])
  .directive(
    'hideTabs',
    function (SharedState, $timeout) {
      return {
        restrict: 'A',
        link: function(scope, element) {
          element.on('focus', function() {
            SharedState.turnOn('hiddenTabs');
            $timeout();
          });
          element.on('blur', function() {
            SharedState.turnOff('hiddenTabs');
            $timeout();
          });
          scope.$on('$destroy', function() {
            element.off('focus');
            element.off('blur');
          });
        }
      };
    });
