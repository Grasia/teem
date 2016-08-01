'use strict';

angular.module('Teem')
  .directive('selector', [function() {

    return {
      controller: [
      '$scope', '$timeout',
      function(scope, $timeout) {

        scope.config = angular.merge({}, scope.config);
        // source: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        function randomId(){
          return Math.floor((1 + Math.random()) * 0x1000000)
            .toString(16);
        }
        scope.selector = {
          id: 'selector' + randomId()
        };

        var oldOnInitialize = scope.config.onInitialize;
        var oldOnFocus = scope.config.onFocus;
        var oldOnBlur = scope.config.onBlur;

        scope.config.onInitialize = function(selectize) {

          selectize.$control.find('input')[0].autocapitalize = scope.config.autocapitalize;

          if (typeof oldOnInitialize === 'function') {
            oldOnInitialize(selectize);
          }
          $timeout();

          scope.selectorCacheUpdate = function(key, value, type){

            var cached = selectize.renderCache[type][key];

            var newValue;

            if (type === 'item') {
              var removeAddon = angular.element(cached).children()[1];
              value += removeAddon.outerHTML;
            }

            // update cached element
            newValue = angular.element(cached).html(value);

            newValue[0].className += ' cachedOption';

            selectize.renderCache[type][key] = newValue[0].outerHTML;

            $timeout();

            return newValue.html();
          };
        };

        scope.focused = false;

        scope.config.onFocus = function(selectize){
          scope.focused = true;
          if (typeof oldOnFocus === 'function'){
            oldOnFocus(selectize);
          }
          $timeout();
        };

        scope.config.onBlur = function(selectize){
          scope.focused = false;
          if (typeof oldOnFocus === 'function'){
            oldOnBlur(selectize);
          }
          $timeout();
        };

      }],
      transclude: true,
      scope: {
        multiple : '=',
        config : '=',
        options :'=',
        ngModel : '=',
        placeholder : '=',
        name : '='
      },
      templateUrl: 'selector.html'
    };
  }]);
