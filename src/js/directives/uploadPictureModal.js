'use strict';

angular.module('Teem')
  .directive('uploadPictureModal', function() {
    return {
      controller: ['$scope', 'SharedState', function($scope, SharedState) {
        $scope.pictureFile = '';
        $scope.croppedPicture = '';

        $scope.updatePicture = function(croppedPicture) {
          var cb = SharedState.get('uploadPictureSharedState');
          if (typeof cb === 'function') {
            cb(croppedPicture);
          }
          SharedState.turnOff('uploadPictureSharedState');
        };
      }],
      templateUrl: 'upload-picture-modal.html'
    };
  });
