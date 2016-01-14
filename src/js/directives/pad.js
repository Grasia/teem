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

          $scope.ed = {
            editting: false
          };

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
                  on('focus', function() {
                    $scope.editOn();
                  }).
                  on('blur', function() {
                    $scope.editOff();
                  });
              }
            });
          };

          $scope.editOn = function() {
            $scope.ed.editting = true;

            SessionSvc.showSaving = true;

            $timeout();
          };

          $scope.editOff = function() {
            $scope.ed.editting = false;

            SessionSvc.showSaving = false;

            $timeout();
          };
      }],
      templateUrl: 'pad.html'
    };
  });
