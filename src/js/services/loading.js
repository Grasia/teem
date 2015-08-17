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
           'SharedState', '$rootElement', '$rootScope',
           function(SharedState, $rootElement, $rootScope) {
    SharedState.initialize($rootScope, 'notLoading', { defaultValue: false });

    Pear2PearLoading.create({
      callback: function() {
        SharedState.turnOff('notLoading');
      }
    });

    function show() {
      SharedState.turnOff('notLoading');
      $rootElement.addClass('has-modal');
      $rootElement.addClass('has-modal-overlay');

      Pear2PearLoading.start();
    }

    function hide() {
      Pear2PearLoading.pause();
      $rootElement.removeClass('has-modal');
      $rootElement.removeClass('has-modal-overlay');

      SharedState.turnOn('notLoading');
    }

    return {
      show: show,
      hide: hide
    };
  }]);

