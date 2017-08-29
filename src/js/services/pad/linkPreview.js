(function() {
	'use strict';


/**
 * @module Teem
 * @method linkPreview
 * @param {String} url
 * Returns the parsed meta data of the given link
 */

let linkPreviewFactory = angular.module('Teem');


function linkPreview($http) {
  const LINK_PREVIEW_SERVER_URL = 'http://localhost:9090/fetch';
  function getMetaData(url){
    //TODO: implement a check for the URL to be correct
    if(!url){
      return;
    }
    return $http.post(LINK_PREVIEW_SERVER_URL,{url})
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
  }

  return {
    getMetaData
  };
}
linkPreview.$inject = ['$http'];
linkPreviewFactory.factory('linkPreview', linkPreview);
})();