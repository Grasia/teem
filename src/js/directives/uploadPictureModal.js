'use strict';

angular.module('Teem')
  .directive('uploadPictureModal', function() {
    return {
      controller: ['$scope', 'SharedState', function($scope, SharedState) {
        $scope.pictureFile = '';
        $scope.croppedPicture = '';
        var cb = {};

        $scope.$on('mobile-angular-ui.state.changed.uploadPictureSharedState', function(e, newValue) {
          cb = newValue;
          if (cb.areaType === 'rectangle') {
            $scope.areaType = 'rectangle';
            $scope.aspectRatio = 1.56;
            $scope.imgSize = {w: 640, h: 410};
          } else {
            $scope.areaType = $scope.aspectRatio = $scope.imgSize = undefined;
          }
        });

        function dataURItoBlob(dataURI) {
          var type = dataURI.split(';')[0].substr(5);
          var binary = atob(dataURI.split(',')[1]);
          var array = [];
          for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }
          return new Blob([new Uint8Array(array)], {type});
        }

        $scope.updatePicture = function(croppedPicture) {
          if (!croppedPicture) {
            return croppedPicture;
          }
          if (typeof cb === 'function') {
            cb(cb.dataURI ? croppedPicture : dataURItoBlob(croppedPicture));
          }
          SharedState.turnOff('uploadPictureSharedState');
        };
      }],
      templateUrl: 'upload-picture-modal.html'
    };
  });
