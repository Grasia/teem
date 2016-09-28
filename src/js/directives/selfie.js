'use strict';

// Adapted directive from https://github.com/SchizoDuckie/selfie.js

angular.module('Teem')
.directive('selfie', function() {
  return {
    restrict: 'E',
    templateUrl: 'selfie.html',
    scope: {
      resultImage: '='
    },
    link: function($scope, iElement) {

      var video = iElement.find('video')[0];
      var canvas = iElement.find('canvas')[0];
      var ctx = canvas.getContext('2d');
      var stream;

      navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
      if (navigator.getUserMedia) {
        navigator.getUserMedia({
          video: true
        },
        function(localMediaStream) {
          stream = localMediaStream;
          video.src = window.URL.createObjectURL(localMediaStream);
        }, console.error);
      } else {
        console.error('No usermedia api available.');
      }

      $scope.TakeSelfie = function() {
        $scope.taken = true;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        if(angular.isDefined($scope.resultImage)) {
          $scope.resultImage = canvas.toDataURL('image/png');
        }
      };

      $scope.$on('$destroy', function() {
        stream.getTracks()[0].stop();
      });
    }
  };
});
