'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:MatchmakingCtrl
 * @description
 * # MatchmakingCtrl
 * Controller of the Teem
 */

var communities = [{
  name: 'Music',
  logo: '/images/interests/technology.png',
  description: 'The Collaborative Technology Alliance (CTA) is currently a loose informal alliance of people and projects working on collaborative technology projects. We envision the future of the social web as an ecosystem of collaborative tools designed to enable communities, guilds, and loosely affiliated groups everywhere to collaborate, share resources, sensemake and create at a scale.',
  tags: ['resources', 'technology alliance cta', 'ecosystem', 'server', 'loose informal alliance', 'rejuvenate']
}];

angular.module('Teem')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/matchmaking', {
        templateUrl: 'matchmaking.html',
        controller: 'MatchmakingCtrl',
        // Change between tabs without re-rendering the view
        reloadOnSearch: false
      });
  }])
  .controller('MatchmakingCtrl', [
    'SessionSvc', '$scope', '$rootScope', '$location', '$route', '$timeout', 'swellRT',
    'SharedState', 'ProjectsSvc', 'Loading', '$window', 'NewForm', 'CommunitiesSvc', 'User', 'Selector',
    function(SessionSvc, $scope, $rootScope, $location, $route, $timeout, swellRT,
      SharedState, ProjectsSvc, Loading, $window, NewForm, CommunitiesSvc, User, Selector) {

      var editingTitle = false;


      var initialize = function() {
        $scope.communities = communities;
      };

      SessionSvc.onLoad(initialize);


      function currentTab() {
        return $location.search().tab || 'communities';
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

      $scope.currenTag = function(tag){
        console.log(tag);
      };

      $scope.swipeToLend = swipeToProjectTab('lend');
      $scope.swipeToCommunities = swipeToProjectTab('communities');

      $scope.hmManagerOpt = '{"cssProps": {"userSelect": true}}';
      $scope.hmRecognizerOpt = '{"threshold": 200}';


      SharedState.initialize($scope, 'hiddenTabs');

      $scope.$on('mobile-angular-ui.state.changed.projectTab', function(e, newVal, oldVal) {
        $location.search({ tab: newVal });
      });


    }
  ]);
