'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ThanksappCtrl
 * @description
 * # Thanksapp Ctrl
 * Controller of the Pear2Pear
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/thanksapp/:mode/:id', {
        templateUrl: 'views/thanksapp/thanksapp.html',
        controller: 'ThanksappCtrl'
      })
  }])
  .controller('ThanksappCtrl', ['$scope', '$location', '$route', '$modal', function($scope, $location, $route, $modal){
    var apply = function () {
      var p = $scope.$$phase;
      if (p !== '$digest' && p !== '$apply') {
        $scope.$apply();
      }
    };

    $scope.$parent.hideNavigation = true;
    $scope.mode = $route.current.params['mode'];
    $scope.userId = $route.current.params['id'];

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
          if (typeof model.root.get($scope.userId) == 'undefined'){
            var list = model.createList();
            list = model.root.put($scope.userId,list); // list is attached to the sub map: root->map->list
          }
          model.root.get($scope.userId).registerEventHandler(
            WaveJS.events.ITEM_ADDED, function (item) {
              var index = -1;
              var i = 0;
              while ( index == -1 && i < model.root.get($scope.userId).values.length) {
                if (model.root.get($scope.userId).values[i].getValue() == item.getValue())
                  index = i;
                i ++;
              }
              $scope.thanks[index] = JSON.parse(item.getValue());
              apply();
            });
          window.WaveJS.model.root.get($scope.userId).registerEventHandler(
             WaveJS.events.ITEM_REMOVED, function (item) {
              var index = window.WaveJS.model.root.get($scope.userId).values.indexOf(item);
              $scope.thanks.splice(index, 1);
              apply();
            });
          $scope.thanks = [];
          for (var i = 0; i < model.root.get($scope.userId).values.length; i++) {
            $scope.thanks[i] = JSON.parse(model.root.get($scope.userId).values[i].getValue());
          }
          apply();
          
        }, function (error) {
          window.alert('Error accessing the collaborative list ' + error);
        });
    };

    $scope.clear = function () {
      var wjsList = window.WaveJS.model.root.get($scope.userId);
      for (var i = wjsList.size()-1; i >= 0 ; i--) {
        wjsList.remove(i);
      }
      $scope.testIndex = 0;
    };

    $scope.isControl = function () {
      return $location.url().indexOf('control') > -1;
    };

    $scope.init();
    
    $scope.thanksForm = {};

    $scope.customThanks = function(name, text) {
      var s = JSON.stringify({
        'name': name,
        'text': text,
        'photo': 'images/profile1.jpg'
      });
      var str = window.WaveJS.model.createString(s);
      str = window.WaveJS.model.root.get($scope.userId).add(str);
    };

    $scope.newWaveId = function () {
      window.alert(window.WaveJS.createModel());
    };

    $scope.profile = function (name){
      $location.url('thanksapp/view/'+name);
    };

    //display the add thanks form
    $scope.formDisp = false;
    $scope.switchForm = function(){
      $scope.formDisp = ! $scope.formDisp;
    };
    
    $scope.items = ['TODO!'];

    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: 'sm'// ,
        // resolve: {
        //   items: function () {
        //     return $scope.items;
        //   }
        // }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.thanksappify = function (string){
      var re = new RegExp('(\<@)(\\w+)', 'g');
      var s =string.replace(re, '<a href="#/thanksapp/view/$2"><strong><i class="icon-thanksapplogo"></i>$2</strong></a>');
      return s;
    };
    
  }]);

angular.module('Pear2Pear').controller('ModalInstanceCtrl', function ($scope, $modalInstance, $route, $location) {
  $scope.register = {};

  $scope.ok = function () {
    $location.url('/thanksapp/commingsoon/' + $route.current.params['id']);
    $modalInstance.close('foo');
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
