'use strict';

angular.module('Teem')
  .directive('uploadPictureModal', function() {
    return {
      controller: ['$scope', 'SharedState', '$timeout', '$filter', function($scope, SharedState, $timeout, $filter) {
        var cb = {};

        $scope.$on('mobile-angular-ui.state.changed.modal.uploadPicture', function(e, newValue) {
          cb = newValue && newValue.callback || {};
          $scope.pic = {
            pictureFile: '',
            croppedPicture: ''
          };
          if (cb.areaType === 'rectangle') {
            $scope.areaType = 'rectangle';
            $scope.aspectRatio = 1.56;
            $scope.imgSize = {w: 640, h: 410};
          } else {
            $scope.areaType = $scope.aspectRatio = $scope.imgSize = undefined;
          }
        });

        $scope.updatePicture = function(croppedPicture) {
          if (typeof cb === 'function') {
            if (!croppedPicture) {
              cb();
            } else {
              cb(cb.dataURI ? croppedPicture : $filter('dataUriToBlob')(croppedPicture));
            }
          }
          SharedState.turnOff('modal.uploadPicture');
          $timeout();
        };
      }],
      templateUrl: 'upload-picture-modal.html'
    };
  });
