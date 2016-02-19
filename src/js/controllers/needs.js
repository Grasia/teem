'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:NeedsCtrl
 * @description
 * # Needs Ctrl
 * Show Needs for a given project
 */

angular.module('Teem')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/communities/:comId/projects/:id/needs', {
        templateUrl: 'needs/index.html',
        controller: 'NeedsCtrl'
      });
  }])
  .directive(
    'needDisplay',
    function(SessionSvc, ProjectsSvc, $route){
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

          SessionSvc.onLoad(function(){
            ProjectsSvc.findByUrlId($route.current.params.id).then(
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
            SessionSvc.loginRequired(function() {
              ProjectsSvc.findByUrlId($route.current.params.id).then(function(project){
                project.addNeedComment(scope.need, scope.newComment.text);
                scope.newComment.text = '';
              });
            });
          };

          scope.hour = needsCtrl.hour;

          scope.newComments = function(need){
            if (!need.comments || !scope.project || !scope.project.getTimestampAccess().needs){
              return false;
            }

            var prevAccess = new Date(scope.project.getTimestampAccess().needs.prev);
            var lastComment = new Date(need.comments[need.comments.length -1].time);
            return prevAccess < lastComment;
          };

          scope.isNewNeed = function(need){
            if (!scope.project || !scope.project.getTimestampAccess().needs){
              return false;
            }
            var prevAccess = new Date(scope.project.getTimestampAccess().needs.prev);
            var needTime = new Date(need.time);
            return prevAccess < needTime;
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
          project: '=',
          needs: '='
        },
        controller: function($scope, $route, SessionSvc, ProjectsSvc, time) {
          this.addNeed = function (need) {
            console.dir(need);
            if (need.text !== undefined && need.text !== ''){
              need.author = SessionSvc.users.current();
              need.time = (new Date()).toJSON();

              $scope.needs.push(need);
              $scope.project.setTimestampAccess('needs', true);
            }
          };
          this.removeNeed = function (need) {
            var i = $scope.needs.indexOf(need);

            $scope.needs.splice(i,1);
          };

          this.comments = {};

          var comments = this.comments;

          this.toggleCommentsVisibility = function toggleCommentsVisibility(need) {
            comments.visible = (comments.visible === need) ? null : need;
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
