'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ChatpadCtrl
 * @description
 * # Chatpad Ctrl
 * Controller of the Pear2Pear
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/cp/:mode/:id', {
        templateUrl: 'chatpad/chatpad.html',
        controller: 'ChatpadCtrl'
      })
      .when('/chatpad/:mode/:id', {
        templateUrl: 'chatpad/chatpad.html',
        controller: 'ChatpadCtrl'
      });
  }])
  .controller('ChatpadCtrl', ['$scope', '$location', '$route', function($scope, $location, $route){
    $scope.$parent.hideNavigation = true;
    var apply = function () {
      var p = $scope.$$phase;
      if (p !== '$digest' && p !== '$apply') {
        $scope.$apply();
      }
    };

    if (!location.origin) {
      location.origin = location.protocol + '//' + location.host;
    }

    $scope.mode = $route.current.params.mode;
    $scope.padId = $route.current.params.id;

    $scope.init = function () {
      // following if avoids concurrency control error in wave
      if (window.SwellRT.model) {
        window.SwellRT.closeModel(
          window.swellrtConfig.chatpadWaveId);
        window.SwellRT.model = null;
      }

      window.SwellRT.openModel(
        window.swellrtConfig.chatpadWaveId,
        function (model) {
          window.SwellRT.model = model;
          if (typeof model.root.get($scope.padId) == 'undefined'){
            var str = model.createString('');
            str = model.root.put($scope.padId, str); // list is attached to the sub map: root->map->list
          } else {
            $scope.pad = model.root.get($scope.padId).getValue();
          }

          model.root.get($scope.padId).registerEventHandler(
            SwellRT.events.ITEM_CHANGED,
            function (newStr, oldStr) {
              $scope.pad = newStr;
              apply();
            });
            
          apply();
        }, function (error) {
          window.alert('Error accessing the collaborative list ' + error);
        });
    };

    $scope.clear = function () {
      var wjsList = window.SwellRT.model.root.get($scope.padId);
      for (var i = wjsList.size()-1; i >= 0 ; i--) {
        wjsList.remove(i);
      }
      $scope.testIndex = 0;
    };

    $scope.isControl = function () {
      return $location.url().indexOf('control') > -1;
    };

    $scope.init();

    $scope.padForm = {};


    $scope.customChatMessage = function(name, text) {
      var s = text;
      
      if (typeof window.SwellRT.model.root.get($scope.padId) === 'undefined'){
        var list =  window.SwellRT.model.createList();
        var map = window.SwellRT.model.root;
        list = map.put($scope.padId,list);
      }
      var str =  window.SwellRT.model.createString(s);
      str = window.SwellRT.model.root.get($scope.padId).add(str);
    };

    $scope.newWaveId = function () {
      window.alert(window.SwellRT.createModel());
    };

    $scope.profile = function (name){
      $location.url('chatpad/view/'+name);
    };

    $scope.chatpadify = function (string){
      var re = new RegExp('(\<@)(\\w+)', 'g');
      return string.replace(re, '<a href= "' + location.origin + '/#/chatpad/view/$2"><strong><i class="icon-chatpadlogo"></i>$2</strong></a>');
    };

    $scope.chatpadMails = function (string){
      window.alert(string);
    };

    $scope.ok = function () {
      $location.url('/chatpad/commingsoon/' + $route.current.params.id);
    };

    $scope.$watch('pad', function() {
      if (window.SwellRT.model !== undefined){
        window.SwellRT.model.root.get($scope.padId).setValue($scope.pad);
        apply();
      }
    });
    $scope.getLocation = function () {
      return location.origin + '/#/cp/v/' + $scope.padId;
    };
  }]);
