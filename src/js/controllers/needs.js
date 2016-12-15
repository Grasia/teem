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
      .when('/communities/:comId/teems/:id/needs', {
        templateUrl: 'needs/index.html',
        controller: 'NeedsCtrl'
      });
  }])
  .directive(
    'needDisplay',
    function(SessionSvc, ProjectsSvc, $route, User){
      return {
        //require: '^needList',
        scope: {
          need: '='
        },
        link: function (scope) {

          scope.toggleCompleted = function (need, event) {
            // Needed by the magic of material design
            event.preventDefault();

            scope.project.toggleNeedCompleted(need);
          };

          scope.updateNeed = function(need) {
            if (need.completed === 'add'){
              if (need.text) {
                scope.project.addNeed(need);

                scope.need = {completed: 'add', text: ''};
              }
            }
            else if (need.text === ''){

              scope.project.removeNeed(need);
            }
          };

          scope.focusNeed = function(event) {
            angular.element(event.target).parent().find('textarea').focus();
          };

          SessionSvc.onLoad(function(){
            ProjectsSvc.findByUrlId($route.current.params.id).then(
              function(project){
                scope.project = project;
              }
            );
          });

          scope.keyEventsHandler = function(event){
            if (event.which === 13) { // enter
              event.target.blur();
            }
            if ((event.which === 8) && (scope.need.text === '')) { // backspace
              event.preventDefault();
              scope.updateNeed(scope.need);
            }
          };

          scope.keyDown = function(event){
            if (event.which === 13) { // enter
              scope.sendComment();

              // Do not add new line to comment input
              event.preventDefault();
            }
          };

          scope.focusElem = function(event){
            event.target.parentNode.parentNode.children[1].children[0].focus();
          };

          scope.assignYourself = function(need) {
            need.assignees = [User.currentId()];
          };

          scope.toggleCommentsVisibility = function(){

          };

          scope.newComment = {
            text: ''
          };

          scope.areCommentsVisible = function() {
            return true;
          };

          scope.sendComment = function(){
            SessionSvc.loginRequired(scope, function() {
              scope.project.addNeedComment(scope.need, scope.newComment.text);
              scope.newComment.text = '';
            }, undefined, scope.project.synchPromise());
          };

          //scope.hour = needsCtrl.hour;

          scope.newComments = function(need){
            if (!need || !need.comments || !need.comments.length || !scope.project || !scope.project.isParticipant()){
              return false;
            }

            var prevAccess = new Date(scope.project.getTimestampAccess().needs.prev);
            var lastComment = new Date(need.comments[need.comments.length -1].time);
            return prevAccess < lastComment;
          };

          scope.isNewNeed = function(need){
            if (!need || !scope.project || !scope.project.isParticipant() ||
            !scope.project.getTimestampAccess() || !scope.project.getTimestampAccess().needs){
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
  );
