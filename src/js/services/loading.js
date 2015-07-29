'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.service:Loading
 * @description
 * # Loading service
 * Provides controllers and services with a loading screen facility
 */

angular.module('Pear2Pear')
  .factory('loading', [
           'SharedState', '$rootElement',
           function(SharedState, $rootElement) {
    var initialized = false;

    function show() {
      SharedState.turnOn('loading');
      $rootElement.addClass('has-modal');
      $rootElement.addClass('has-modal-overlay');

      if (!initialized) {
        Pear2PearLoading.create();
        initialized = true;
      } else {
        Pear2PearLoading.start();
      }
    }

    function hide() {
      Pear2PearLoading.pause();
      $rootElement.removeClass('has-modal');
      $rootElement.removeClass('has-modal-overlay');

      SharedState.turnOff('loading');
    }

    return {
      show: show,
      hide: hide
    };
  }]);


