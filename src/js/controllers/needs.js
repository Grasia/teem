'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:NeedsCtrl
 * @description
 * # Needs Ctrl
 * Show Needs for a given project
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/communities/:communityId/projects/:id/needs', {
        templateUrl: 'needs/index.html',
        controller: 'NeedsCtrl'
      });
  }])
  .controller('NeedsCtrl', [
              'pear', '$scope', '$route',
              function(pear, $scope, $route){

    $scope.urlId = pear.urlId;
    $scope.communityId = $route.current.params.communityId;

    pear.onLoad(function(){
      pear.projects.find($route.current.params.id).then(
        function(proxy){
          $scope.project = proxy;
        }
      );
    });

    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262
    $scope.nav = function(id) {
      return id === 'needs' ? 'active' : '';
    };
  }])
  .directive(
    'needDisplay',
    function(){
      return {
        require: '^needList',
        scope: {
          need: '='
        },
        link: function (scope, element, attrs, needsCtrl) {
          scope.toggleCompleted = function (need) {
            var completed = (need.completed === 'true') ? true : false;
            need.completed = (!completed).toString();
            if (completed) {
              need.completionDate = new Date().toString();
            } else {
              need.completionDate = '';
            }
          };

          scope.updateNeed = function(need) {
            if (need.completed === 'add'){
              need.completed = 'false';
              needsCtrl.addNeed(need);
              scope.need = {completed: 'add', text: ''};
            }
            else if (need.text === ''){
              needsCtrl.removeNeed(need);
            }
          };

          scope.keyEventsHandler = function(event){
            if ((event.charCode === 0) && (event.keyCode === 13)){
              event.target.blur();
            }
            if ((event.charCode === 0) && (event.keyCode === 8) && (scope.need.text === '') ){
              scope.updateNeed(scope.need);
            }
          };

          scope.focusElem = function(event){
            event.target.parentNode.children[1].focus();
          };
        },
        templateUrl: 'needs/need.html',
        transclude: true
      };
    }
  ).directive(
    'needList',
    function () {
      return {
        templateUrl: 'needs/list.html',
        transclude: true,
        scope: {
          needs: '='
        },
        controller: function($scope) {
          this.addNeed = function (need) {
            if (need.text !== ''){
              $scope.needs.push(need);
            }
          };
          this.removeNeed = function (need) {
            var i = $scope.needs.indexOf(need);
            $scope.needs.splice(i,1);
          };
        }
      };
    }
  );
