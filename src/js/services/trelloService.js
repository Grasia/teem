(function () {
  'use strict';

  angular
    .module('Teem')
    .factory('trelloSvc', trelloSvc);
  trelloSvc.$inject = ['$http', '$location', '$window', '$rootScope', '$timeout', '$q'];
  function trelloSvc($http, $location, $window, $rootScope, $timeout, $q) {
    const AUTH_ROUTE = 'https://trello.com/1/authorize';

    function getToken() {
      localStorage.setItem('projectUrl', $location.path());
      const redirUrl = 'https://trello.com/1/authorize?expiration=never&name="Teem"&key=09e4aced60041e389dbb27b9accadd65&callback_method=fragment&scope=read%2Cwrite%2Caccount&return_url=http://localhost:8000/trello/get/';
      $window.location.href = redirUrl;
    }

    function parseTokenFromUrl(urlString) {
      console.log(urlString);
    }

    function createTrelloBoard(prObj, need) {
      let deferred = $q.defer();
      if (!prObj.trello.token) {
        getToken();
        deferred.resolve();
        return deferred.promise;
      }
      const BoardApiURL = `https://api.trello.com/1/boards/?name=${prObj.id}&key=09e4aced60041e389dbb27b9accadd65&token=${prObj.trello.token}`;
      $http.post(BoardApiURL).then((result) => {
        console.log(result);
        deferred.resolve(result.data);
      })
        .catch((err) => {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function createNewList(trelloObj) {
      let deferred = $q.defer();
      if (!trelloObj.boardId) {
        deferred.reject('No trello Board Id found!');
      }
      else {
        const listAPIendPoint = `https://api.trello.com/1/lists?name=Teem&idBoard=${trelloObj.boardId}&key=09e4aced60041e389dbb27b9accadd65&token=${trelloObj.token}`;
        $http.post(listAPIendPoint)
          .then((data) => {
            console.log(data);
          })
          .catch(err => console.log(err));
      }
      return deferred.promise;
    }

    function addNewcard(trelloObj,need){
      let deferred = $q.defer();
      deferred.resolve(need);
      return deferred.promise;
      // const newCardURL = `https://api.trello.com/1/cards?idList=${trelloObj.listId}&`
    }


    let service = {
      getToken: getToken,
      parseTokenFromUrl: parseTokenFromUrl,
      createTrelloBoard: createTrelloBoard,
      createNewList: createNewList,
      addNewcard: addNewcard
    };

    return service;
  }
})();
