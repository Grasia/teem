'use strict';

angular.module('Teem')
  .filter('dataUriToBlob', function() {
    return function(dataURI = '') {
      var type = dataURI.split(';')[0].substr(5);
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type});
    };
  });
