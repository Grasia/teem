'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ChatCtrl
 * @description
 * # Chat Ctrl
 * Show Pad for a given project
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/projects/:id/pad', {
        templateUrl: 'pad/show.html',
        controller: 'PadCtrl'
      });
  }])
  .controller('PadCtrl', ['pear', '$scope', '$route', '$location', function(pear, $scope, $route, $location){

    pear.onLoad(function(){
      $scope.project = pear.projects.find($route.current.params.id);
    });

    $scope.showChat = function() {
      $location.path('/projects/' + $scope.project.id + '/chat');
    };

    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262
    $scope.nav = function(id) {
      return id === 'pad' ? 'active' : '';
    };
  }]).directive(
    'needDisplay',
    function(){
      return {
        require: '^needList',
        scope: {
          need: '=',
        },
        link: function (scope, element, attrs, needsCtrl) {
          scope.toggleCompleted = function (need) {
            var completed = eval(need.completed);
            need.completed = (!completed).toString();
            if (completed) {
              need.completionDate = new Date().toString();
            } else {
              need.completionDate = '';
            }
          };
          scope.addNeed = function(need) {
            if (need.completed === 'add'){
              need.completed = 'false';
              needsCtrl.addNeed(need);
              scope.need = {completed: 'add', text: ''};
            }
          };
        },
        templateUrl: 'pad/need.html',
        transclude: true,
      }
    }
  ).directive(
    'needList',
    function () {
      return {
        templateUrl: 'pad/need-list.html',
        transclude: true,
        scope: {
          needs: '='
        },
        controller: function($scope) {
          this.addNeed = function (need) {
            console.log($scope.needs.push(need));
          };
        }
      };
    }
  );
