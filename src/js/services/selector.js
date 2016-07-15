'use strict';

/**
* @ngdoc function
* @name Teem.service:url
* @description
* # url service
* It provides several url common functions to be used by several controllers
*/

angular.module('Teem')
.factory('Selector', [
  'User', '$timeout', 'CommunitiesSvc', '$rootScope', 'Notification', '$compile',
  function(User, $timeout, CommunitiesSvc, $rootScope, Notification, $compile) {


    // builds a list of users for user selector from SwellRT query result
    function buildUserItems(users){
      var res = [];
      users.forEach(function(i){
        var nick = i._id.split('@')[0];
        if (nick !== ''){
          res.push({
            _id: i._id,
            nick: i._id.split('@')[0]
          });
        }
      });

      return res;
    }

    return {
      buildUserItems,
      // map of default configs
      config: {
        users: {
          plugins: ['remove_button'],
          valueField:'_id',
          labelField:'nick',
          searchField:'nick',
          autocapitalize: 'off',
          load: function(query, callback){
            if (!query.length) {
              return callback();
            }
            User.usersLike(query)
            .then(function(r){
              callback(buildUserItems(r));
              $timeout();
            }, function(){
              callback();
              $timeout();
            });
          },
          //code based on https://selectize.github.io/selectize.js/ email example
          createFilter: function(input){
            var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
            '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

            var match, regex;

            regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
            match = input.match(regex);
            if (match){
              return !this.options.hasOwnProperty(match[0]);
            }
            return false;
          },
          //code based on https://selectize.github.io/selectize.js/ email example
          create: function(input){
            return {
              nick: input,
              _id: JSON.stringify({
                email: input
              })
            };
          },
          onDropdownOpen(dropdown){
            dropdown[0].scrollIntoView();
          },
          closeAfterSelect: true,
          onOptionAdd(value, data){
            console.log(value, data);
          },
          onChange(value, data){
            console.log('change', value, data);
          },
          render: {
            // item: function(item, escape) {
            //   var avatar = '<div>' +
            //     '<span avatars="\'' + escape(item._id) +'\'" class="avatars"></span>' +
            //     escape(item.nick) +
            //     '</div>';
            //
            //   var compiledAvatar =  $compile(avatar)($rootScope, function(compiled){
            //     console.log(angular.element.avatar);
            //     angular.element(avatar).html(compiled);
            //   });
            //
            //   $timeout();
            //
            //   console.log(compiledAvatar.html(), compiledAvatar[0].outerHTML);
            //   return avatar;
            // },
            item: function(item, escape) {

              var randomId = Math.floor((1 + Math.random()) * 0x10000000000000000)
                .toString(16);
              var avatar = '<div id="' + randomId + '">' +
                '<span avatars="\'' + escape(item._id) +'\'" class="avatars"></span>' +
                escape(item.nick) +
              '</div>';

              $timeout(function(){
                var elem = $compile(avatar)($rootScope, function(comp){
                  var result = document.getElementById(randomId);
                  console.log(angular.element(comp[0]));
                  angular.element(result).html(comp[0]);
                  $timeout();
                });


              });

              return avatar;
            }
          },
        }
      },
      /* Populates the user selector options (optionList)
       * witht the users that participate in the community
       * or co-contributors if there are no communities
       */
      populateUserSelector: function(optionList, communities) {

        if (communities && communities.length > 0){
          CommunitiesSvc.communitiesContributors(
            communities
          ).then(function(result){
            optionList.push(buildUserItems(result));
          });
        } else {
          User.coContributors().then(function(r){
            optionList.push(buildUserItems(r));
          });
        }
      },

      invite: function(invitees, hasParticipantsObject){

        var users  = [],
            emails = [];

        if (invitees){
          // TODO: Should we move it to a service?
          let notificationScope = $rootScope.$new(true);
          notificationScope.values = {};

          invitees.forEach(function(i){

            var value;

            try {
              value = JSON.parse(i);
            }
            // if it is an existing user
            catch (e) {
              hasParticipantsObject.addParticipant(i);

              users.push(i);

              return;
            }

            // if it is an email address
            if (typeof value === 'object'){
              if (value.email) {
                emails.push(value.email);
              }
            }
          });

          if (users.length) {
            notificationScope.values.addedParticipants = users.map(u => u.split('@')[0]).join(', ');
            Notification.success({message: hasParticipantsObject.type + '.participate.add.notification', scope: notificationScope });
          }

          if (emails.length > 0){
            SwellRT.invite(emails, hasParticipantsObject.url(),
              // project.title || community.name
              hasParticipantsObject.title || hasParticipantsObject.name, function(s){console.log(s);}, function(e){console.log('error:', e);});

            notificationScope.values.invitedParticipants = emails.join(', ');
            Notification.success({message: hasParticipantsObject.type + '.participate.invite.notification', scope: notificationScope });
          }
        }
      }
    };

  }]);
