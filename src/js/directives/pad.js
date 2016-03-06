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
            editting: false
          };

          function editOn () {
            $scope.pad.editting = true;

            SessionSvc.showSaving = true;

            $timeout();
          }

          function editOff () {
            $scope.pad.editting = false;

            SessionSvc.showSaving = false;

            $timeout();
          }

          $scope.padReady = function() {
            // FIXME
            // SwellRT editor is created with .wave-editor-off
            // Should use .wave-editor-on when SwellRT editor callback is available
            // https://github.com/P2Pvalue/swellrt/issues/84
            var editor = angular.element(document.getElementById('pad').children[0]);

            $scope.$watch(function() {
              return editor.attr('class');
            },
            function(newClass) {
              if (newClass === 'wave-editor-on') {
                editor.
                  on('focus', editOn).
                  on('blur', editOff);
              } else if (newClass === 'wave-editor-off') {
                editor.
                  off('focus', editOn).
                  off('blur', editOff);
              }
            });
          };

      }],
      templateUrl: 'pad.html'
    };
  });
