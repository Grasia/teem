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
              need = scope.project.findNeed(needId),
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
          });

          // Wait for the directive to be compiled before adding it
          $timeout(() => {
            angular.element(parent).append(compiled);

            // on blur, bump need version to generate SwellRT event
            compiled[0].querySelector('textarea').addEventListener('blur', function(){
              need.version =
                ((parseInt(need.version) || 0) + 1).toString();
            });
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
      }

      need = scope.project.addNeedWithoutTrello(need);
      //FIXME Doesn't work with the Trello integration, for now the ones created in pad cannot be added to Trello
      // need = scope.project.addNeed(need);


      // To generate need added event after all the info is available
      $timeout();

      if (selection.text) {
            need.version = '1';
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
