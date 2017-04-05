//module that check if input string is an acceptable format of url, return true/false
module.exports.checkValidURL = function(str){
    //regex to test if it's a valid website, credit to http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without
    var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/;
    return urlRegEx.test(str);
}
