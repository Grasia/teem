'use strict';

angular.module('Teem')
  .factory('needWidget', [
  '$compile', '$timeout',
  function($compile, $timeout) {
    var editor, scope;

    function init (e, s) {
      editor = e;
      scope = s;

      editor.registerWidget('need', {
        onInit: function(parent, needId) {
          var element = angular.element(document.createElement('need-widget')),
              compiled = $compile(element)(scope),
              need = scope.project.findNeed(needId),
              stopEvents = ['keypress', 'keyup', 'keydown'],
              isolateScope;

          function stopEvent (e) { e.stopPropagation(); }

          stopEvents.forEach(function (eventName) {
            parent.addEventListener(eventName, stopEvent);
          });

          $timeout(function() {
            isolateScope = element.isolateScope();

            isolateScope.project = scope.project;
            isolateScope.need = need;
          });

          angular.element(parent).append(compiled);
        }
      });
    }

    function add () {
      var need = {
            text: ''
          },
          selection = editor.getSelection();

      if (selection.toString()) {
        need.text = selection.toString();

        selection.remove();
      }

      scope.project.addNeed(need);

      $timeout(() => {
        editor.addWidget('need', need._id);
      });

      $timeout(() => {
        var textarea = document.querySelector('.need-form-' + need._id + ' textarea');

        if (textarea) {
          textarea.focus();
        }
      }, 500);
    }

    return {
      init,
      add
    };
  }]);
