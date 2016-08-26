'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:CommunitiesCtrl
 * @description
 * # CommunitiesCtrl
 * Controller of the Teem
 */
angular.module('Teem')
  .directive('communities', ['SessionSvc', '$location', '$window', '$document', '$timeout',
  function (SessionSvc, $location, $window, $document, $timeout) {
    return {
      link: function(scope, element, attrs) {

        scope.newCommunityName = {
          name : ''
        };

        scope.container = attrs.container;

        var overflowLast = 100000;

        angular.element(attrs.container).bind('scroll', function () {
          $timeout(function(){
            overflowLast =
            element.children(0).children().last().offset().top;
          });
        });

        scope.farFromLast = function() {
          return overflowLast > 2 * angular.element($window).height();
        };

        scope.reset = function() {
          if (scope.newCommunityName.name === '') {
            scope.creating = false;
          }
        };

        scope.showCommunity = function(community) {
          $location.path(community.path());
        };
      },
      templateUrl: 'communities/communities.html'
    };
  }]);
