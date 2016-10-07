'use strict';

class CordovaTakePictureCtrl {

  constructor ($scope, $timeout, SessionSvc, SharedState) {
    'ngInject';

    this.width = 1200;
    this.height = 900;

    this.$scope = $scope;
    this.$timeout = $timeout;
    this.SharedState = SharedState;
  }

  selectSource () {
    this.SharedState.turnOn('modal.cordovaTakePicture');
  }

  sourceType (source) {
    switch (source) {
      case 'camera':
        return Camera.PictureSourceType.CAMERA;
      case 'gallery':
        return Camera.PictureSourceType.PHOTOLIBRARY;
      default:
        return Camera.PictureSourceType.CAMERA;
    }
  }

  take (source) {
    var options = {
      sourceType: this.sourceType(source),
      // FIXME DATAURL can be very memory intensive and cause app crashes or out of memory errors. Use FILEURI or NATIVE_URI if possible
      destinationType: Camera.DestinationType.DATA_URL,
      targetWith: this.width,
      targetHeight: this.height
    };

    navigator.camera.getPicture(
      (picture) => { this.onSuccess(picture); },
      (error) => { this.onError(error); },
      options);
  }

  onSuccess (picture) {
    // FIXME standarize this in the component API
    this.$scope.$parent.pic.croppedPicture = 'data:image/jpeg;base64,' + picture;

    this.SharedState.turnOff('modal.cordovaTakePicture');

    this.$scope.$parent.goToNextForm();
  }

  onError (error) {
    this.$scope.error = error;
    this.$timeout();
  }
}


angular.module('Teem').
  component('cordovaTakePicture', {
    controller: CordovaTakePictureCtrl,
    templateUrl: 'cordova-take-picture.html'
  });
