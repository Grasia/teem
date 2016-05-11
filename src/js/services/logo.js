'use strict';

/**
 * @ngdoc function
 * @name Teem.service:logo
 * @description
 * # logo service
 * It provides several logo common functions to be used by several controllers
 */

angular.module('Teem')
  .factory('Logo', [function() {
    const LogoTypes = ['aubergine', 'blue', 'teal', 'yellow'];

    class Logo {
      defaultLogo() {
        var type = this.id.slice(-1).charCodeAt(0) % LogoTypes.length;

        return '/images/' + this.type + '_' + LogoTypes[type] + '.svg';
      }
    }

    return Logo;
  }]);
