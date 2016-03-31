'use strict';

angular.module('Teem')
  .directive('avatars', ['$timeout', 'SessionSvc', function($timeout, SessionSvc) {

    var palette = ['#47C9EB', '#0067A5', '#052140', '#F4CF60', '#D89440', '#FF5C45', '#4CC799', '#99BD54', '#002826', '#F580B3', '#FA0070', '#E3002B', '#960F29', '#542E2E'];

    function setPalette(hexColorArray){
      palette = hexColorArray;
    }

    function onImgError(evt) {
      evt.target.src = 'images/anonymous-avatar.png';
    }

    function link(scope, element) {
      var createAppendAvatar = function(userId, url){
        $timeout(function() {
          var conf = scope.avatarsConf() || {};
          var div = angular.element('<div class="avatar'+(conf.size ? '-'+conf.size : '')+'"></div>'),
              img = angular.element('<img></img>'),
              name = angular.element('<div class="avatar-name">' + userId.split('@')[0] + '</div>');

          img[0].addEventListener('error', onImgError);

          div.append(img[0]);

          if (conf.names) {
            div.append(name[0]);
          }

          element.append(div[0]);

          if (url) {
            img[0].src = url;

          } else {
            var avatarConfig = {
              'useGravatar': false,
              'initials': userId[0].toUpperCase(),
              'initial_bg': palette[parseInt(window.md5(userId).substring(0,5),16) % palette.length], 'initial_fg': 'white',
              'initial_weight': 200,
              'size': 200
            };
            new window.Avatar(img[0], avatarConfig);
          }
        });
      };
      scope.$watchCollection('avatars', function(users){
        if (!users || users.length === 0){
          return;
        }

        element.empty();

        // if there is only one name
        if (typeof users === 'string'){
          users = [users];
        }

        SessionSvc.getUserProfile(users, function(res) {
          if (res.error) {
            return;
          }
          angular.forEach(res.data, function(user) {
            createAppendAvatar(user.id, user.avatarUrl);
          });
        });

      });
    }

    return {
      scope: {
        avatars: '=',
        avatarsConf: '&'
      },
      link: link,
      setPalette: setPalette
    };
  }]);
