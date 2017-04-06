//check if input string is an acceptable format of url, return true/false
module.exports.checkValidURL = function(str){
    //regex to test if it's a valid website, credit to http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without
    var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/;
    return urlRegEx.test(str);
}

//add https to url if needed, causes problem with redirect if link to website without https or http
module.exports.addHttps = function(url){
    //check if url contains https or http
    var re = /^([http]|[https])/g;
    if(re.test(url)){
        return url;
    }
    //if not add https:// in front
    return ('http://').concat(url);
}