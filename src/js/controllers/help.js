'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the Teem
 */

angular.module('Teem')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/collab/work/:id', {
        templateUrl: 'help/show-collab.html',
        controller: 'HelpCtrl'
      })
      .when('/collab/learn/:id', {
        templateUrl: 'help/show-learn.html',
        controller: 'HelpCtrl'
      })
      .when('/collab/:viewmode/:id/new', {
        templateUrl: 'help/form.html',
        controller: 'HelpCtrl'
      })
      .when('/collab/show/:id/:item', {
        templateUrl: 'help/show.html',
        controller: 'HelpCtrl'
      })
      .when('/collab/:id/control', {
        templateUrl: 'help/show-collab.html',
        controller: 'HelpCtrl'
      });

  }])

  .controller('HelpCtrl', ['$scope', '$location', '$route', function($scope, $location, $route){

    $scope.$parent.hideNavigation = false;
    var apply = function () {
      var p = $scope.$$phase;
      if (p !== '$digest' && p !== '$apply') {
        $scope.$apply();
      }
    };

    $scope.communityId = $route.current.params['id'];
    $scope.categories = {
      learn : [],
      contrib : []
    };
    $scope.init = function () {
      // following if avoids concurrency control error in wave
      if (window.SwellRT.model) {
        window.SwellRT.closeModel(
          window.swellrtConfig.helpWaveId);
      }

      window.SwellRT.openModel(
        window.swellrtConfig.helpWaveId,
        function (model) {
          window.SwellRT.model = model;
          if (typeof model.root.get($scope.communityId) == 'undefined'){
            var list = model.createList();
            list = model.root.put($scope.communityId,list); // list is attached to the sub map: root->map->list
          }
          model.root.get($scope.communityId).registerEventHandler(
            SwellRT.events.ITEM_ADDED, function (item) {
              var index = -1;
              var i = 0;
              while ( index == -1 && i < model.root.get($scope.communityId).values.length) {
                if (model.root.get($scope.communityId).values[i].getValue() == item.getValue())
                  index = i;
                i ++;
              }
              $scope.help[index] = JSON.parse(item.getValue());
              apply();
            });
          window.SwellRT.model.root.get($scope.communityId).registerEventHandler(
             SwellRT.events.ITEM_REMOVED, function (item) {
              var index = window.SwellRT.model.root.get($scope.communityId).values.indexOf(item);
              $scope.help.splice(index, 1);
              apply();
            });
          $scope.help = [];
          for (var i = 0; i < model.root.get($scope.communityId).values.length; i++) {
            $scope.help[i] = JSON.parse(model.root.get($scope.communityId).values[i].getValue());
          }
          apply();

        }, function (error) {
          window.alert('Error accessing the collaborative list ' + error);
        });
    };

    $scope.clear = function () {
      var wjsList = window.SwellRT.model.root.get($scope.communityId);
      for (var i = wjsList.size()-1; i >= 0 ; i--) {
        wjsList.remove(i);
      }
      $scope.testIndex = 0;
    };

    $scope.isControl = function () {
      return $location.url().indexOf('control') > -1;
    };

    $scope.init();

    $scope.helpForm = {};
    $scope.addHelpRequest = function(what, details,support,learn) {
      var s = JSON.stringify({
        'what': what,
        'details': details,
        'support': support,
        'learn': learn
      });
      var str = window.SwellRT.model.createString(s);
      str = window.SwellRT.model.root.get($scope.communityId).add(str);
      $scope.helpForm = {};
      $scope.backToList();
    };

    $scope.backToList = function(){
      var i = $location.path().search('/new');
      if (i !== -1){
        var s = $location.path().substring(0, i);
        $location.path(s);
      } else {
        $scope.nav('learn');
      }
    };

    $scope.newWaveId = function () {
      window.alert(window.SwellRT.createModel());
    };

    // To be called either with 'learn' or 'support' to retrieved categories
    $scope.categories = function(name){
      if (!$scope.help) {
        return [];
      }
      var arrays = $scope.help.map(
        function(n){
          return n[name];
        });

      var categs;
      if (arrays.length === 0){
        categs = [];
      } else {
        categs = arrays.reduce(
          function(a, b){
            return a.concat(b);
          }
        );
      }
      return $scope.uniq(categs);
    };

    $scope.uniq = function (a) {
      return a.sort().filter(function (item, pos) {
        return !pos || item !== a[pos - 1];
      });
    };

    $scope.new_ = function () {
      $location.path($location.path() + '/new').replace();
    };

    $scope.show = function (itemId) {
      $location.path('/collab/show/' + $scope.communityId + '/' + itemId);
    };

    //switch view, call it with 'learn' or 'collab'
    $scope.nav = function(where){
      $location.path('/collab/' + where + '/' + $scope.communityId);
    };

    $scope.join = function (b) {
      if (b) {
        _paq.push(['trackEvent', 'joinActivity', 'true']);
      } else {
        _paq.push(['trackEvent', 'joinActivity', 'false']);
      }
    };

    $scope.item = {};
    $scope.selectedItem = function () {
      // TODO improve performance, now O(n)
      // TODO duplicate "whats" will not work with this impl.
      if ($scope.item && $scope.item.what === $route.current.params['item']){
        return $scope.item;
      }
      for (var item in $scope.help) {
        if ($scope.help[item].what === $route.current.params['item']) {
          $scope.item = $scope.help[item];
          return $scope.item;
        }
      }
      return {};
    };
  }]);
