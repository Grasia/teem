'use strict';

angular.module('Teem')
  .directive('selector', [function() {

    return {
      controller: [
      '$scope', '$element', '$attrs', 'SharedState', '$timeout',
      function(scope, $element, $attrs, SharedState, $timeout) {

        scope.config = angular.merge({}, scope.config);
        // source: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        function randomId(){
          return Math.floor((1 + Math.random()) * 0x1000000)
            .toString(16);
        }
        scope.selector = {
          id: 'selector' + randomId()
        };

        scope.select = function(){
          scope.selectorModal = false;
          $timeout();
        };
        scope.ng = {model: scope.model};
        scope.$watch('ng.model', function() {
          scope.model = scope.ng.model;
        });


        $timeout();

        var oldOnInitialize = scope.config.onInitialize;
        var oldOnFocus = scope.config.onFocus;

        scope.config.onInitialize = function(selectize) {
          selectize.$control.find('input')[0].autocapitalize = scope.config.autocapitalize;
          if (typeof oldOnInitialize === 'function') {
            oldOnInitialize(selectize);
          }
        };

        scope.config.onFocus = function(selectize){
          if (!Modernizr.mq('(min-width: 992px)')) {
            scope.selectorModal = true;
            $timeout(function() {
              $timeout(function() {
                document.querySelector('.selector-has-modal .selectize-input input').click();
              }, 500);
            });
          }
          if (typeof oldOnFocus === 'function'){
            oldOnFocus(selectize);
          }
        };
      }],
      transclude: true,
      scope: {
        multiple : '=',
        config : '=',
        options :'=',
        model : '=',
        placeholder : '=',
        name : '='
      },
      templateUrl: 'selector.html'
    };
  }]);
