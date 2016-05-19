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
  'User', '$timeout', 'CommunitiesSvc',
  function(User, $timeout, CommunitiesSvc) {

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
          }
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
      }
    };

  }]);
