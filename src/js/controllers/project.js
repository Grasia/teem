
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
      // We need these routes here to take precendence on /teems/:id
      // but note we are using the projects (plural) controller
      .when('/teems/new', {
        templateUrl: 'projects/project.html',
        controller: 'ProjectsCtrl'
      })
      .when('/teems/featured', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      })
      .when('/teems/latest', {
        templateUrl: 'projects/index.html',
        controller: 'ProjectsCtrl'
      })
      .when('/teems/:id', {
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
      })
      .when('/trello/get/',{
        controller: 'TrelloGetController',
        template: '<h1>Redirecting ....</h1>'
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
        localId: localId,
        projection: ProjectsSvc.projectListProjection
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
  'SessionSvc', '$scope', '$rootScope', '$location', '$route', '$timeout', 'swellRT', '$filter',
  'SharedState', 'ProjectsSvc', 'Loading', '$window', 'CommunitiesSvc', 'User', 'Selector', '$http', '$translate','trelloSvc',
  function (SessionSvc, $scope, $rootScope, $location, $route, $timeout, swellRT, $filter,
  SharedState, ProjectsSvc, Loading, $window, CommunitiesSvc, User, Selector, $http, $translate, trelloSvc) {

    // Prevent users from forging the form parameter
    // and set the form order
    const Forms = [ 'image', 'details', 'share', 'congrats' ];

    // Use them in steps template
    $scope.formSteps = Forms;

    // Hack to hide the navbar
    // We should be using the class .has-navbar-top automatically added by
    // mobile-angular-ui, it should be removed when the navbar is removed
    // by ui-content-for, but it is not happening
    $rootScope.noNavbarTop = true;
    $scope.$on('$destroy', () => {
      $rootScope.noNavbarTop = false;
    });

    var editingTitle = false;

    // FIXME Defined here instead of inside pad because when pad scope is destroyed,
    // `editing` variable can't be accessed, and it is used outside pad.
    $scope.pad = {
      editing: false,
      saving: false,
      outline: []
    };
    $scope.pic = {};

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

    $scope.form = function () {
      var f = $route.current.params.form;

      if (f && Forms.indexOf(f) >= 0) {
        return f;
      }
    };

    $scope.formStep = function() {
      return Forms.indexOf($route.current.params.form) + 1;
    };

    $scope.nextForm = function () {
      var index = Forms.indexOf($route.current.params.form) + 1;

      if (index > 0 && index < Forms.length) {
        return Forms[index];
      }

      return null;
    };

    $scope.goToNextForm = function () {
      if ($scope.form() === 'image' && $scope.pic.croppedPicture) {
        $scope.uploadProjectPhoto($filter('dataUriToBlob')($scope.pic.croppedPicture));
      }
      $location.search('form', $scope.nextForm());
    };

    $scope.uploadProjectPhoto = function(file) {
      $scope.project.image = new swellRT.FileObject(file);
    };

    $scope.editingTitle = function() {
      return editingTitle;
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
      SharedState.turnOff('modal.confirm');

      $scope.project.delete();

      if ($location.search('form')) {
        $location.search('form', null);
      }
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
        create: function(input, callback) {
          CommunitiesSvc.create({ name: input }, (community) => {
            callback(community);
          });
        },
        load: function(query, callback) {
          CommunitiesSvc.all({ nameLike: query }).then((communities) => {
            callback(communities);
          });
        },
        valueField: 'id',
        labelField: 'name',
        searchField: 'name',
        maxOptions: 10,
        onChange: function(ids) {
          // Hack: set scope communities to display them later
          $scope.communities = $scope.communitySelector.options.filter(community => ids.includes(community.id));
        },
        plugins: ['remove_button'],
        onDropdownOpen(dropdown){
          dropdown[0].scrollIntoView();
        },
        closeAfterSelect: true
      }
    };
    $scope.locationSelector = {
      options: [],
      config: {
        mode: 'single',
        openOnFocus: false,
        delimiter: null,
        valueField: 'geonameId', //geoname id
        labelField: 'name',
        searchField: 'name',
        create: false,
        closeAfterSelect: true,
        options: [],
        onChange: function(item){

          var idAsNum = parseInt(item[0]);
          // retrieve the selected value from selectize's options
          var newValue = $scope.locationSelector.options.filter(function(a){
            return a.geonameId === idAsNum ;
          })[0];

          $scope.project.location = newValue.value;
        },

        render: {
          option: function(item) {
            return '<div>' + item.name + ', ' + item.adminName1 + ', ' + item.countryName + '</div>';
          },
        },

        load: function(query, callback) {
          if (!query.length){
            return callback();
          }

          let lang = $translate.use();
          let url = `http://api.geonames.org/search?name_startsWith=${query}&maxRows=10&featureClass=P&username=teem&type=json&lang=${lang}`;
          url = 'https://jsonp.afeld.me/?url=' + window.escape(url);

          $http({
            method: 'GET',
            url
          }).then(function (response) {
            angular.forEach(response.data.geonames, function(v) {
              v.value = {
                 id: v.geonameId.toString(),
                 latitide: v.lat,
                 longitude: v.lng,
                 name: v.name,
               };
            });

            callback(response.data.geonames);
          }, function () {
            callback();
          });
        },

        location: []

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
      SharedState.turnOff('modal.share');
      SharedState.turnOff('modal.invite');
    };

    $scope.cancelInvite = function(){
      $scope.invite.selected = [];
      SharedState.turnOff('modal.share');
      SharedState.turnOff('modal.invite');
    };

    $scope.focusTitleInput = function() {
      $('.title-input').focus();
    };

    $scope.createProjectFormInvalid = function() {
      // There should be a better way to implement this
      try {
        let form = angular.element('[name="createProjectForm"]');

        return form.scope().createProjectForm.$invalid;
      } catch(e) {
        return false;
      }

    };

    $scope.getToken = function () {
      trelloSvc.getToken();
    };

    $scope.archiveProject = function() {
      // TODO
    };

  }])
  .controller('TrelloGetController', ['$location','ProjectsSvc','SessionSvc', function($location,ProjectsSvc,SessionSvc){
    let token = $location.hash().split('=')[1];
    localStorage.setItem('trelloTeemToken',token);
    SessionSvc.onLoad(function(){
      ProjectsSvc.updateTrello();
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
