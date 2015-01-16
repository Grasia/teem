'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the Pear2Pear
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/collab', {
        templateUrl: 'views/help/show.html',
        controller: 'HelpCtrl'
      });
  }])

  .controller('HelpCtrl', ['$scope', '$location', function($scope, $location){
    var apply = function () {
      var p = $scope.$$phase;
      if (p !== '$digest' && p !== '$apply') {
        $scope.$apply();
      }
    };

    // TODO change for a communityId when community selection is implemented
    $scope.communityId = 'Tabacalera';

    $scope.init = function () {
      // following if avoids concurrency control error in wave
      if (window.WaveJS.model) {
        window.WaveJS.closeModel(
          window.configTimelineTests.helpWaveId);
      }
      
      window.WaveJS.openModel(
        window.configTimelineTests.helpWaveId,
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
              $scope.help[index] = JSON.parse(item.getValue());
              apply();
            });
          window.WaveJS.model.root.get($scope.communityId).registerEventHandler(
             WaveJS.events.ITEM_REMOVED, function (item) {
              var index = window.WaveJS.model.root.get($scope.communityId).values.indexOf(item);
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
    
    $scope.helpForm = {};
    $scope.addHelpRequest = function(what, details) {
      var s = JSON.stringify({
        'what': what,
        'details': details,
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
