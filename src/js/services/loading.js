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
           '$rootElement', '$rootScope',
           function($rootElement, $rootScope) {
    Pear2PearLoading.create({
      callback: function() {
        $rootScope.notLoading = true;
      }
    });

    function show() {
      $rootScope.notLoading = false;
      $rootElement.addClass('has-modal');
      $rootElement.addClass('has-modal-overlay');

      Pear2PearLoading.start();
    }

    function hide() {
      Pear2PearLoading.pause();
      $rootElement.removeClass('has-modal');
      $rootElement.removeClass('has-modal-overlay');

      $rootScope.notLoading = true;
    }

    return {
      show: show,
      hide: hide
    };
  }]);
