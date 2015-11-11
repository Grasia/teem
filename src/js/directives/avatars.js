'use strict';

angular.module('Pear2Pear')
  .directive('avatars', ['$timeout', function($timeout) {

    var palette = ['#47C9EB', '#0067A5', '#052140', '#F4CF60', '#D89440', '#FF5C45', '#4CC799', '#99BD54', '#002826', '#F580B3', '#FA0070', '#E3002B', '#960F29', '#542E2E'];

    function setPalette(hexColorArray){
      palette = hexColorArray;
    }

    function link(scope, element) {
      scope.$watchCollection('avatars', function(value){
        if (!value || value.length === 0){
          return;
        }

        element.empty();

        var createAppendAvatar = function(userId){
          $timeout(function() {
            var div = angular.element('<div class="avatar"></div>'),
                img = angular.element('<img></img>'),
                name = angular.element('<div class="avatar-name">' + userId.split('@')[0] + '</div>');

            div.append(img[0]);

            if (scope.avatarsName()) {
              div.append(name[0]);
            }

            element.append(div[0]);

            var avatarConfig = {
              'useGravatar': false,
              'initials': userId[0].toUpperCase(),
              'initial_bg': palette[parseInt(window.md5(userId).substring(0,5),16) % palette.length], 'initial_fg': 'white',
              'initial_weight': 200,
              'initial_font_family': '"Dax Wide Regular", sans-serif'
            };
            new window.Avatar(img[0], avatarConfig);
          });
        };

        // if there is only one name
        if (typeof value === 'string'){
          createAppendAvatar(value);
        }
        // if it is a collection of names:
        else {
          angular.forEach(value, function(val){
            createAppendAvatar(val);
          });
        }
      });
    }

    return {
      scope: {
        avatars: '=',
        avatarsName: '&'
      },
      link: link,
      setPalette: setPalette
    };
  }]);
