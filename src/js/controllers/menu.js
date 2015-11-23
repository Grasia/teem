'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the Pear2Pear
 */

angular.module('Pear2Pear')
  .controller('MenuCtrl', [
  '$scope', 'config', 'url', 'SwellRTSession', 'CommunitiesSvc', 'Loading',
  function($scope, config, url, SwellRTSession, CommunitiesSvc, Loading){
    if (config.support) {
      $scope.support = {
        communityId: url.urlId(config.support.communityId),
        projectId:   url.urlId(config.support.projectId)
      };
    }

    SwellRTSession.onLoad(function(){
      var communitiesPromise = CommunitiesSvc.participating();

      Loading.create(communitiesPromise);

      communitiesPromise.then(function(communities) {
        $scope.myCommunities = communities;
      });
    });
  }]);
