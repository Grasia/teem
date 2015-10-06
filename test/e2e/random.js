/**
* Random utils
* From http://qainsight.blogspot.com.es/2014/04/get-random-string-email-string-and.html
*/

/**
* Usage: Return Random Email Id.
*/
exports.emailUser = function emailUser() {
    var strValues = "abcdefghijk123456789.";
    var strEmail = "";
    for (var i = 0; i < strValues.length; i++) {
        strEmail = strEmail + strValues.charAt(Math.round(strValues.length * Math.random()));
    }

    return strEmail;
};

exports.email = function email () {
    return emailUser + "@mymail.test";
};

/**
* Usage: Generate random string.
* characterLength :  Length of string.
* Returns : Random string.
*/
exports.string = function (characterLength) {
    var randomText = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < characterLength; i++)
        randomText += possible.charAt(Math.floor(Math.random() * possible.length));
    return randomText;
};

/**
* Usage: Generate random number.
* characterLength :  Length of number.
* Returns : Random number.
*/
exports.number = function (numberLength) {
    var randomNumber = "";
    var possible = "0123456789";
    for (var i = 0; i < numberLength; i++)
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    return randomNumber;
};
