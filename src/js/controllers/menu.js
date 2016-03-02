'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the Teem
 */

angular.module('Teem')
  .controller('MenuCtrl', [
  '$scope', 'config', 'url', 'SessionSvc', 'CommunitiesSvc', 'Loading',
  function($scope, config, url, SessionSvc, CommunitiesSvc, Loading){
    if (config.support) {
      $scope.support = {
        communityId: url.urlId(config.support.communityId),
        projectId:   url.urlId(config.support.projectId)
      };
    }

    SessionSvc.onLoad(function(){
      Loading.show(CommunitiesSvc.participating()).
        then(function(communities) {
          $scope.myCommunities = communities;
        });
    });
  }]);
