
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
        controller: 'FetchProject',
        template: ''
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
  'ProjectsSvc', 'Url', '$route', '$location', 'SessionSvc',
  function(ProjectsSvc, Url, $route, $location, SessionSvc) {

    var communityId = Url.decode($route.current.params.communityId),
        localId     = $route.current.params.id;

    SessionSvc.onLoad(() => {

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
    });
  }])
  .controller('ProjectCtrl', [
  'SessionSvc', '$scope', '$rootScope', '$location', '$route', '$timeout', 'swellRT',
  'SharedState', 'ProjectsSvc', 'Loading', '$window', 'NewForm', 'CommunitiesSvc', 'User', 'Selector',
  function (SessionSvc, $scope, $rootScope, $location, $route, $timeout, swellRT,
  SharedState, ProjectsSvc, Loading, $window, NewForm, CommunitiesSvc, User, Selector) {

    // Prevent users from forging the form parameter
    // and set the form order
    const Forms = [ 'image', 'title', 'share', 'congrats' ];

    var editingTitle = false;

    // FIXME Defined here instead of inside pad because when pad scope is destroyed,
    // `editing` variable can't be accessed, and it is used outside pad.
    $scope.pad = {
      editing: false,
      saving: false,
      outline: []
    };

    $scope.editOff = function() {
      angular.element(document.querySelector('pad')).scope().editOff();
    };

    $scope.invite = {
      list : [],
      selected : []
    };

    var initialize = function(){
      Loading.show(ProjectsSvc.findByUrlId($route.current.params.id)).
        then(function(project) {
          $scope.project = project;
          Selector.populateUserSelector($scope.invite.list, $scope.project.communities);

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
          $timeout();
        });
    };

    SessionSvc.onLoad(initialize);

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

    if($route.current.params.form === 'new'){
      SharedState.turnOn('hiddenTabs');
    }

    NewForm.initialize($scope, 'project');

    $scope.form = function () {
      var f = $route.current.params.form;

      if (f && Forms.indexOf(f) >= 0) {
        return f;
      }
    };

    $scope.nextForm = function () {
      var index = Forms.indexOf($route.current.params.form) + 1;

      if (index > 0 && index < Forms.length) {
        return Forms[index];
      }

      return null;
    };

    $scope.goToNextForm = function () {
      $location.search('form', $scope.nextForm());
    };

    $scope.uploadProjectPhoto = function(file) {
      $scope.project.image = new swellRT.FileObject(file);
    };

    $scope.editingTitle = function() {
      return editingTitle || $scope.isNew();
    };

    $scope.infoTip = function(close) {
      if (close) {
        localStorage.setItem('clickToTap', true);
      }
      return !localStorage.getItem('clickToTap');
    };

    $scope.showEditTitle = function() {
      editingTitle = true;
    };

    $scope.hideEditTitle = function() {
      editingTitle = false;
    };

    $scope.titleReminder = function titleReminder() {
      SharedState.turnOff('modalSharedState');
      $scope.showEditTitle();
      $timeout(function(){
        document.querySelector('.title-input').focus();
      });
    };

    $scope.createProject = function() {
      let params = {};

      ProjectsSvc.create(params, function(p) {
        $location.path(p.path()).search('form', 'image');
      });
    };

    $scope.$on('mobile-angular-ui.state.changed.projectTab', function(e, newVal, oldVal) {
      $scope.project.setTimestampAccess(oldVal);
      $scope.project.setTimestampAccess(newVal);

      $location.search({ tab: newVal});

      $scope.pad.editing = false;
    });

      $scope.$on('$routeChangeStart', function(event, next, current) {
      if (current.params.tab !== undefined && $scope.project!== undefined) {
        $scope.project.setTimestampAccess(current.params.tab);
      }
    });

    $scope.cancelProject = function() {
      SharedState.turnOff('modalSharedState');

      $scope.project.delete();

      $location.path('/home/teems');
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
        maxOptions: 10,
        onChange: function(ids) {
          $scope.communities = $scope.communitySelector.options.filter(community => ids.includes(community.id));
          Selector.populateUserSelector($scope.invite.list, $scope.project.communities);
        },
        plugins: ['remove_button'],
        onDropdownOpen(dropdown){
          dropdown[0].scrollIntoView();
        },
        closeAfterSelect: true
      }
    };
    SessionSvc.onLoad(function() {
      CommunitiesSvc.participating({ projectCount: true }).then(function(communities){
        $scope.communitySelector.options = angular.extend([], $scope.communities, communities);
      });
    });

    $scope.userSelectorConfig = Selector.config.users;

    $scope.inviteUsers = function(){
      Selector.invite($scope.invite.selected, $scope.project);
      $scope.invite.selected = [];
      SharedState.turnOff('modalSharedState');
    };

    $scope.cancelInvite = function(){
      $scope.invite.selected = [];
      SharedState.turnOff('modalSharedState');
    };

    $scope.focusTitleInput = function() {
      $('.title-input').focus();
    };

    $scope.archiveProject = function() {
      // TODO
    };

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
