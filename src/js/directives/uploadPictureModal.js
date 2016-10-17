'use strict';

angular.module('Teem')
  .directive('uploadPictureModal', function() {
    return {
      controller: ['$scope', 'ModalsSvc', '$timeout', '$filter', function($scope, ModalsSvc, $timeout, $filter) {
        $scope.pic = {
          pictureFile: '',
          croppedPicture: ''
        };
        var cb = {};

        $scope.$on('mobile-angular-ui.state.changed.modal.uploadPicture', function(e, newValue) {
          cb = newValue && newValue.callback || {};
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
          ModalsSvc.turnOff('modal.uploadPicture');
          $timeout();
        };
      }],
      templateUrl: 'upload-picture-modal.html'
    };
  });
