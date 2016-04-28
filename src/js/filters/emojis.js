'use strict';

angular.module('Teem')
  .filter('emojis', function() {

    return function(input = '') {
      var emoji = new window.EmojiConvertor();
      /* jshint camelcase:false */
      /*jshint bitwise: false*/
      emoji.use_sheet = true;
      emoji.img_sets = {
        'apple'    : {'sheet' : 'images/sheet_apple_64.png',    'mask' : 1 },
        'google'   : {'sheet' : 'images/sheet_google_64.png',   'mask' : 2 },
        'twitter'  : {'sheet' : 'images/sheet_twitter_64.png',  'mask' : 4 },
        'emojione' : {'sheet' : 'images/sheet_emojione_64.png', 'mask' : 8 }
      };

      var output = emoji.replace_unified(input.replace(/&#\d+;/g, function(code) {
        code = parseInt(code.substr(2));
        if (code < 0x10000) {
          return String.fromCharCode(code);
        }
        code -= 0x10000;
        return String.fromCharCode(
          0xD800 + (code >> 10),
          0xDC00 + (code & 0x3FF)
        );
      }));

      output = emoji.replace_colons(output);
      return output;
    };
  });
