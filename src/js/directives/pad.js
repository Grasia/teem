'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:ChatCtrl
 * @description
 * # Chat Ctrl
 * Show Pad for a given project
 */

angular.module('Teem')
  .directive('pad', function() {
    return {
      scope: true,
      link: function($scope, elem, attrs) {
        $scope.editingDefault = attrs.editingDefault;
      },
      controller: [
        'SessionSvc', '$rootScope', '$scope', '$route', '$location',
        '$timeout', 'SharedState', 'needWidget',
        function(SessionSvc, $rootScope, $scope, $route, $location,
        $timeout, SharedState, needWidget) {


          var buttons = ['header', 'bold', 'italic', 'strikethrough', 'align-left', 'align-center', 'align-right', 'list', 'list-ol'];

          $scope.padCreate = function(editor) {



            needWidget.init(editor, $scope);

            editor.registerWidget('img', {
              onInit: function(parentElement, state) {
                $scope.project.attachments[state].file.getUrl().then(url => {
                  parentElement.innerHTML='<img src="'+url+'">';
                });
              },
              onChangeState: function(parentElement, before, state) {
                $scope.project.attachments[state].file.getUrl().then(url => {
                  parentElement.innerHTML='<img src="'+url+'">';
                });
              }
            });
          };

          $scope.padReady = function(editor) {
            // FIXME
            // SwellRT editor is created with .wave-editor-off
            // Should use .wave-editor-on when SwellRT editor callback is available
            // https://github.com/P2Pvalue/swellrt/issues/84
            var editorElement = angular.element(document.getElementById('pad').children[0]);

            var annotationMap = {
              header: 'paragraph/header=h3',
              bold: 'style/fontWeight=bold',
              italic: 'style/fontStyle=italic',
              strikethrough: 'style/textDecoration=line-through',
              'align-left': 'paragraph/textAlign=left',
              'align-center': 'paragraph/textAlign=center',
              'align-right': 'paragraph/textAlign=right',
              list: 'paragraph/listStyleType=unordered',
              'list-ol': 'paragraph/listStyleType=decimal'
            };

            $scope.buttons = {};
            buttons.forEach(btn => $scope.buttons[btn] = false);

            editor.onSelectionChanged(function(annotations) {
              for (let btn of buttons) {
                let [key, val] = annotationMap[btn].split('=');
                $scope.buttons[btn] = (annotations[key] === val);
              }
              $timeout();
            });


            $scope.annotate = function(btn) {
              let [key, val] = annotationMap[btn].split('=');
              $scope.buttons[btn] = !$scope.buttons[btn];
              if (!$scope.buttons[btn]) {
                val = null;
              }
              editor.setAnnotation(key, val);
              editorElement.focus();
            };

            $scope.widget = function(type) {
              if (type === 'need') {
                needWidget.add();
              }
              if (type === 'img') {
                if (arguments[1] === undefined) { // First step
                  $scope.pad.selectingFile = true;
                  $timeout(() => $scope.pad.selectingFile = false);
                } else { // Second step
                  $scope.pad.selectingFile = false;
                  var id = $scope.project.addAttachment(arguments[1]);
                  editor.addWidget('img', id);
                }
              }
            };

            $scope.editOn = function () {
              if (editorElement.attr('class') === 'wave-editor-on') {
                $scope.pad.editing = true;
                SessionSvc.showSaving = true;
                SharedState.turnOn('hiddenTabs');
                $timeout();
              }
            };

            $scope.editOff = function () {
              if (editorElement.attr('class') === 'wave-editor-on') {
                $scope.pad.editing = $scope.editingDefault;
                SessionSvc.showSaving = false;
                SharedState.turnOff('hiddenTabs');
                $timeout();
              }
            };

            if ($scope.editingDefault) {
              $scope.pad.editing = true;
            }
          };

          $scope.$watchCollection(function() {
            return SessionSvc.status;
          }, function(current) {
            $scope.pad.saving = !current.sync;
          });

      }],
      templateUrl: 'pad.html'
    };
  });
