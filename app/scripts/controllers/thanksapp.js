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
      .when('/thanksapp-register/:id', {
        templateUrl: 'views/thanksapp/register.html',
        controller: 'ThanksappCtrl'
      });
  }])
  .controller('ThanksappCtrl', ['$scope', '$location', '$route', function($scope, $location, $route){
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
          window.configTimelineTests.thanksappWaveId);
        window.WaveJS.model = null;
      }
      
      window.WaveJS.openModel(
        window.configTimelineTests.thanksappWaveId,
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
      var reg = new RegExp('(\<@)(\\w+)', 'g');
      var rr;
      var receiver;
      while ((rr = reg.exec(text)) !== null){
      var str = window.WaveJS.model.createString(s);
        console.log(rr);
        receiver =  rr[2];
        console.log(receiver);
        if (typeof window.WaveJS.model.root.get(receiver) === 'undefined'){
          var list =  window.WaveJS.model.createList();
          var map = window.WaveJS.model.root;
          list = map.put(receiver,list);
//          list.add(str);
        }
        str = window.WaveJS.model.root.get(receiver).add(str);
      }

     var emails = $scope.thanksappMails(text,name);
     console.log(emails);
  //    for (var e in emails){
  //      window.alert(emails[e]);
  //   }
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
    
    $scope.open = function (size) {
      $location.url('/thanksapp-register/' + $scope.userId);
    };

    $scope.thanksappify = function (string){
      var re = new RegExp('(\<@)(\\w+)', 'g');
      string domain = window.location.hostname;
      return string.replace(re, '<a href= domain + "/#/thanksapp/view/$2"><strong><i class="icon-thanksapplogo"></i>$2</strong></a>');
    };

    $scope.thanksappMails = function (string, sender){
      var rt = [];
      if (string){
        var re = new RegExp('(\<@)(\\w+)', 'g');
        var re2 = new RegExp('(\<@)(\\w+)', 'g');
        var r;
        while ((r = re2.exec(string))!== null) {
          var receiver = r[2];
          console.log(r);
          var salut = 'Hola ' + receiver + ',<br/><br/>';
          var body = '';
          if (sender){
            body += sender + ' te ha enviado un agracecimiento: "<i>';
          }
          else {
            body += 'Te han enviado un agradecimiento: "<i>';
          }
          string domain = window.location.hostname;
          var s = string
            .replace(re, '<a href= domain + "/#/thanksapp/view/$2"><strong>$1$2</strong></a>');
          s = salut + body + s + '</i>".<br/><br/>puedes ver tus agradecimientos y activar tu cuenta en <a href="#/thanksapp/self/'+receiver+'">tu Thanksapp</a>.';
          rt.push(s);
        }
      }
      return rt;
    };
 
    $scope.ok = function () {
      $location.url('/thanksapp/commingsoon/' + $route.current.params['id']);
    };

    $scope.cancel = function () {
      $location.url('/thanksapp/self/' + $route.current.params['id']);
    };

    // $scope.control = {};

  }]);
