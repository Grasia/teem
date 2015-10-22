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
      .when('/communities/:comId/projects/:id/needs', {
        templateUrl: 'needs/index.html',
        controller: 'NeedsCtrl'
      });
  }])
  .controller('NeedsCtrl', [
              'SwellRTSession', 'url', '$scope', '$route', 'ProjectsSvc',
              function(SwellRTSession, url, $scope, $route, ProjectsSvc){

    $scope.urlId = url.urlId;
    $scope.communityId = $route.current.params.comId;

    SwellRTSession.onLoad(function(){
      ProjectsSvc.find($route.current.params.id).then(
        function(proxy){
          $scope.project = proxy;
          $scope.project.timestampProjectAccess();
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
    function(SwellRTSession, ProjectsSvc, $route){
      return {
        require: '^needList',
        scope: {
          need: '='
        },
        link: function (scope, element, attrs, needsCtrl) {
          scope.toggleCompleted = function (need, event) {

            if (!scope.project.isContributor()){
              return;
            }

            if (need.completed === 'add'){
              scope.focusElem(event);

              return;
            }
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
          SwellRTSession.onLoad(function(){
            ProjectsSvc.find($route.current.params.id).then(
              function(project){
                scope.project = project;
              }
            );
          });

          scope.keyEventsHandler = function(event){
            if (event.which === 13) {
              event.target.blur();
            }
            if ((event.which === 8) && (scope.need.text === '')) {
              event.preventDefault();
              scope.updateNeed(scope.need);
            }
          };

          scope.keyDown = function(event){
            if (event.which === 13) {
              scope.sendComment();
            }
          };

          scope.focusElem = function(event){
            console.log(event.target.parentNode.parentNode.children);
            event.target.parentNode.parentNode.children[1].children[0].focus();
          };

          scope.toggleCommentsVisibility = function(n){
            needsCtrl.toggleCommentsVisibility(n);
          };

          scope.newComment = {
            text: ''
          };

          scope.areCommentsVisible = needsCtrl.areCommentsVisible;
          scope.sendComment = function(){
            ProjectsSvc.find($route.current.params.id).then(function(project){
              project.addNeedComment(scope.need, scope.newComment.text);
              project.addChatNotification(
                'need.comment.notification',
                {
                  user: SwellRTSession.users.current().split('@')[0],
                  need: scope.need.text,
                  comment: scope.newComment.text
                }
              );
              scope.newComment.text = '';
            });
          };
          scope.hour = needsCtrl.hour;
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
        controller: function($scope, $route, SwellRTSession, ProjectsSvc, time) {
          this.addNeed = function (need) {
            if (need.text !== ''){
              $scope.needs.push(need);
              ProjectsSvc.find($route.current.params.id).then(function(project){
                project.addContributor();
                project.addChatNotification(
                  'need.new.notification',
                  {
                    user: SwellRTSession.users.current().split('@')[0],
                    need: need.text
                  }
                );
              });
            }
          };
          this.removeNeed = function (need) {
            var i = $scope.needs.indexOf(need);
            console.log($route.current);
            $scope.needs.splice(i,1);
            console.log($route.current);
          };

          this.comments = {};

          var comments = this.comments;

          this.toggleCommentsVisibility = function toggleCommentsVisibility(need) {
            comments.visible = (comments.visible === null)?need:null;
          };

          this.areCommentsVisible = function areCommentsVisible(need) {
            return comments.visible === need;
          };

          this.hour = function(comment) {
            return time.hour(new Date(comment.time));
          };
        }
      };
    });
