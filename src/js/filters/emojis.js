'use strict';

angular.module('Teem')
  .filter('emojis', function() {
    return function(input = '') {
      var emojione = window.emojione;
      emojione.sprites = true;
      emojione.imageType = 'svg';
      emojione.imagePathSVGSprites = 'images/emojione.sprites.svg';
      return emojione.toImage(input);
    };
  });
