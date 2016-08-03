/*
 * atd:
 * Including this file directly here, so it is easier to make changes,
 * as the repo is not up to date
 * https://github.com/teamjell/angular-bootstrap-material/
 */

/*
The MIT License (MIT)

Copyright (c) 2015 Flock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
  'use strict';

  var module = angular.module('flock.bootstrap.material', []);

  var inputElements = [
    'input',
    'textarea',
    'select'
  ];

  var inputDirective = [function() {
    return {
      restrict: 'E',
      link: function($scope, $element) {
        if ($element.hasClass('form-control')) {
          $.material.input($element);
          $.material.attachInputEventHandlers();
        } else {
          var type = $element.attr('type');
          var func = $.material[type];
          if (typeof(func) === 'function') {
            func($element);
          }
        }
      }
    };
  }];

  for (var i = 0; i < inputElements.length; i++) {
    module.directive(inputElements[i], inputDirective);
  }


  var ripplesDirective = [function() {
    return {
      restrict: 'C',
      link: function($scope, $element) {
        if ($element.hasClass('without-ripple') || $element.hasClass('btn-link')) {
          return;
        }
        $.material.ripples($element);
      }
    };
  }];

  module.directive('with-ripple', ripplesDirective);
  module.directive('cardImage', ripplesDirective);
  module.directive('btn', ripplesDirective);

  var dropdownDirective = function($timeout) {
    return {
      restrict: 'C',
      link: function($scope, $element) {
        $timeout(() => {$element.dropdown();});
      }
    };
  };
  module.directive('dropdown', dropdownDirective);

})();
