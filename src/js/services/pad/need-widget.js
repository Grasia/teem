'use strict';

angular.module('Teem')
  .factory('needWidget', [
  '$compile', '$timeout',
  function($compile, $timeout) {

    function getWidget (scope) {

      return {
        onInit: function(parent, needId) {
          var element = angular.element(document.createElement('need-widget')),
              compiled = $compile(element)(scope),
              need = scope.project.findNeed(needId) || scope.newNeed,
              stopEvents = ['keypress', 'keyup', 'keydown', 'paste'],
              isolateScope;

          // Cancel widget contenteditable attributes
          element.attr('contenteditable', 'false');

          function stopEvent (e) { e.stopPropagation(); }

          stopEvents.forEach(function (eventName) {
            parent.addEventListener(eventName, stopEvent);
          });

          $timeout(() => {
            isolateScope = element.isolateScope();

            isolateScope.project = scope.project;
            isolateScope.need = need;

            isolateScope.onchange = function(){
                  if (!scope.project.findNeed(needId)) {
                    scope.project.addNeed(need);
                    scope.newNeed = undefined;
                  }
                };
          });

          // Wait for the directive to be compiled before adding it
          $timeout(() => {
            angular.element(parent).append(compiled);
          });

        }
      };
    }

    function add (editor, scope) {
      var need = {
            text: ''
          },
          selection = editor.getSelection(),
          widget;

      if (selection.text) {

        need.text = selection.text;

        editor.deleteText(selection);

        scope.project.addNeed(need);

      } else {

        need._id = Math.random().toString().substring(2);

        scope.newNeed = need;
      }

      $timeout(() => {
        widget = editor.addWidget('need', need._id);
      });

      $timeout(() => {
        var textarea = angular.element(widget).find('textarea');

        if (textarea) {
          textarea.focus();
        }
      }, 500);
    }

    return {
      getWidget,
      add
    };
  }]);
