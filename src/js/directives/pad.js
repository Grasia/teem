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
      controller: [
        'SessionSvc', 'url', '$rootScope', '$scope', '$route', '$location',
        '$timeout',
        function(SessionSvc, url, $rootScope, $scope, $route, $location,
        $timeout) {

          $scope.pad = {
            editing: false
          };

          var buttons = ['bold', 'italic', 'underline', 'strikethrough'];

          $scope.padReady = function(editor) {
            // FIXME
            // SwellRT editor is created with .wave-editor-off
            // Should use .wave-editor-on when SwellRT editor callback is available
            // https://github.com/P2Pvalue/swellrt/issues/84
            var editorElement = angular.element(document.getElementById('pad').children[0]);

            var annotationMap = {
              bold: 'style/fontWeight=bold',
              italic: 'style/fontStyle=italic',
              underline: 'style/textDecoration=underline',
              strikethrough: 'style/textDecoration=line-through'
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

            $scope.editOn = function () {
              if (editorElement.attr('class') === 'wave-editor-on') {
                $scope.pad.editing = true;
                SessionSvc.showSaving = true;
                $timeout();
              }
            };

            $scope.editOff = function () {
              if (editorElement.attr('class') === 'wave-editor-on') {
                $scope.pad.editing = false;
                SessionSvc.showSaving = false;
                $timeout();
              }
            };
          };

      }],
      templateUrl: 'pad.html'
    };
  });
