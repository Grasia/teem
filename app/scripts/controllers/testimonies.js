'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:TestimoniesCtrl
 * @description
 * # TestimoniesCtrl
 * Controller of the Pear2Pear
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/testimon/:id', {
        templateUrl: 'views/testimonies/show.html',
        controller: 'TestimoniesCtrl'
      })
      .when('/testimon/:id/control', {
        templateUrl: 'views/testimonies/show.html',
        controller: 'TestimoniesCtrl'
      });
  }])

  .controller('TestimoniesCtrl', ['$scope', '$location', '$route', function($scope, $location, $route){
    var apply = function () {
      var p = $scope.$$phase;
      if (p !== '$digest' && p !== '$apply') {
        $scope.$apply();
      }
    };

    $scope.communityId = $route.current.params['id'];

    $scope.init = function () {
      // following if avoids concurrency control error in wave
      if (window.WaveJS.model) {
        window.WaveJS.closeModel(
          window.configTimelineTests.testimoniesWaveId);
      }
      
      window.WaveJS.openModel(
        window.configTimelineTests.testimoniesWaveId,
        function (model) {
          window.WaveJS.model = model;
          if (typeof model.root.get($scope.communityId) == 'undefined'){
            var list = model.createList();
            list = model.root.put($scope.communityId,list); // list is attached to the sub map: root->map->list
          }
          model.root.get($scope.communityId).registerEventHandler(
            WaveJS.events.ITEM_ADDED, function (item) {
              var index = -1;
              var i = 0;
              while ( index == -1 && i < model.root.get($scope.communityId).values.length) {
                if (model.root.get($scope.communityId).values[i].getValue() == item.getValue())
                  index = i;
                i ++;
              }
              $scope.testimonies[index] = JSON.parse(item.getValue());
              apply();
            });
          window.WaveJS.model.root.get($scope.communityId).registerEventHandler(
             WaveJS.events.ITEM_REMOVED, function (item) {
              var index = window.WaveJS.model.root.get($scope.communityId).values.indexOf(item);
              $scope.testimonies.splice(index, 1);
              apply();
            });
          $scope.testimonies = [];
          for (var i = 0; i < model.root.get($scope.communityId).values.length; i++) {
            $scope.testimonies[i] = JSON.parse(model.root.get($scope.communityId).values[i].getValue());
          }
          apply();
          
        }, function (error) {
          window.alert('Error accessing the collaborative list ' + error);
        });
    };

    $scope.clear = function () {
      var wjsList = window.WaveJS.model.root.get($scope.communityId);
      for (var i = wjsList.size()-1; i >= 0 ; i--) {
        wjsList.remove(i);
      }
      $scope.testIndex = 0;
    };

    $scope.isControl = function () {
      return $location.url().indexOf('control') > -1;
    };

    $scope.init();
    
    $scope.testimForm = {};
    $scope.customTestimony = function(name, text) {
      if (!name) {
        name = prompt('Name of the author of the testimony');
      }
      if (!text) {
        text = prompt('Testimony');
      }
      var s = JSON.stringify({
        'name': name,
        'text': text,
        'photo': 'images/profile1.jpg'
      });
      var str = window.WaveJS.model.createString(s);
      str = window.WaveJS.model.root.get($scope.communityId).add(str);
    };

    $scope.newWaveId = function () {
      window.alert(window.WaveJS.createModel());
    };

    //display the add testimony form
    $scope.formDisp = false;
    $scope.switchForm = function(){
      $scope.formDisp = ! $scope.formDisp;
    };
}]);
