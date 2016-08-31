'use strict';

/**
 * @ngdoc function
 * @name Teem.service:logo
 * @description
 * # logo service
 * It provides several logo common functions to be used by several controllers
 */

angular.module('Teem')
  .factory('Logo', [
    '$location',
    function($location) {

    const CommunityColors = ['aubergine', 'blue', 'teal', 'yellow', 'red', 'green'];
    const ProjectColors = ['aubergine', 'blue', 'teal', 'yellow'];

    class Logo {

      logoColor () {
        let logoColors = this.type === 'community' ? CommunityColors : ProjectColors;
        return logoColors[parseInt(window.md5(this.id).substring(0,5),16) % logoColors.length];
      }

      logoExtension() {
        return this.type === 'community' ? '.png' : '.svg';
      }

      defaultLogo () {
        return '/images/' + this.type + '_' + this.logoColor() + this.logoExtension();
      }

      defaultLogoUrl () {
        // using location.host instead of $location.host because
        // it gives port information when needed

        return $location.protocol() + '://' +  location.host  + this.defaultLogo();
      }

      logo () {
        return this.image && this.image.url || this.defaultLogo();
      }

      logoUrl () {
        return this.image && this.image.url || this.defaultLogoUrl();
      }
    }

    return Logo;
  }]);
