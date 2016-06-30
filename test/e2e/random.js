/**
* Random utils
* From http://qainsight.blogspot.com.es/2014/04/get-random-string-email-string-and.html
*/

'use strict';

/**
* Usage: Return Random Email Id.
*/
function nick() {
  var strValues = 'abcdefghijk123456789.';
  var strEmail = '';
  for (var i = 0; i < strValues.length; i++) {
    strEmail = strEmail + strValues.charAt(Math.round(strValues.length * Math.random()));
  }

  return strEmail;
}

function email () {
  return nick() + '@mymail.test';
}

/**
* Usage: Generate random string.
* characterLength :  Length of string.
* Returns : Random string.
*/
function string (characterLength) {
  var randomText = '',
      possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  if (! characterLength) {
    characterLength = 10;
  }

  for (var i = 0; i < characterLength; i++) {
    randomText += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return randomText;
}

/**
* Usage: Generate random number.
* characterLength :  Length of number.
* Returns : Random number.
*/
function number (numberLength) {
  var randomNumber = '';
  var possible = '0123456789';
  for (var i = 0; i < numberLength; i++) {
    randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return randomNumber;
}

module.exports = {
  nick,
  email,
  string,
  number
};
