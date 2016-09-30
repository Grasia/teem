'use strict';

angular.module('Teem')
  .directive('feature', function() {
    return {
      controller: [
      '$scope', '$element', '$attrs', 'SessionSvc',
      function($scope, $element, $attrs, SessionSvc) {

        $element.on('click', () => {

            SessionSvc.loginRequired($scope, () => {

              $scope.featureModel.toggleFeatured();
            }, undefined, $scope.featureModel.synchPromise());
        });
      }],
      scope: {
        featureCopyOn: '@',
        featureCopyOff: '@',
        featureModel: '='
      },
      templateUrl: 'feature.html'
    };
  });
