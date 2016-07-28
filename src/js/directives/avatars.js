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
        var conf = scope.avatarsConf() || {};
        var container = angular.element('<a href="/users/'+userId+'" class="avatar'+(conf.size ? '-'+conf.size : '')+'"></a>'),
            img = angular.element('<img></img>');

        img[0].addEventListener('error', onImgError);

        container.append(img[0]);
        let name = userId.split('@')[0];
        img[0].title = name;
        container.append(angular.element('<span class="avatar-name">' + name + '</span>'));

        element.append(container[0]);

        if (url) {
          img[0].src = url;

        } else {
          var tmp = angular.element('<img width="200" height="200">');
          var avatarConfig = {
            'useGravatar': false,
            'initials': userId[0].toUpperCase(),
            'initial_bg': palette[parseInt(window.md5(userId).substring(0,5),16) % palette.length], 'initial_fg': 'white',
            'initial_font_family': '"Lato", "Lato-Regular", "Helvetica Neue"',
            'initial_weight': 200,
            'size': 200
          };
          new window.Avatar(tmp[0], avatarConfig);
          img[0].src = tmp[0].src;
        }
      };
      function appendEmptyAvatars() {
        // Fill with empty avatars to align last row of flexbox
        // https://stackoverflow.com/questions/18744164/flex-box-align-last-row-to-grid
        var conf = scope.avatarsConf() || {};
        for (let i = 0; i < 4; i++) {
          element.append(angular.element('<a class="avatar'+(conf.size ? '-'+conf.size : '')+' empty-avatar"></a>'));
        }
      }
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
          appendEmptyAvatars();
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
