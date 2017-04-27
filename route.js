var access = require("./controller/controllerToDB.js");

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var validURL = require("./urlFormats");

module.exports = function(app){
    //render main page
    app.get('/',function(req,res){
        res.render('./display',{url:'',message:'',targetURL:'#'});
    });

    //post request with the url entered as data
    app.post('/',urlencodedParser,function(req,res){
        //holds what's enter by the user
        var holdURL = req.body.urlInput;
        //check if it's an acceptable format of url
        if(validURL.checkValidURL(holdURL)){
            //add http:// in front of website if needed, causes problem with redirect without it
            holdURL = validURL.addHttp(holdURL);
    
            new Promise((resolve, reject)=>{
                access.URLExistInDB(holdURL, function(err, dataReturned){
                    if(err){
                        reject(err);
                    }else{
                        resolve(dataReturned);
                    }
                })
            }).then(function(data){
                if(data!==null){
                    res.render('./display', {url:data.shortURL, message:'',  targetURL:data.originalURL});
                }else{
                    new Promise((resolve, reject)=>{
                        access.countAndSaveNewURL(holdURL, function(err, updatedData){
                            if(err){
                                reject(err);
                            }else{
                                resolve(updatedData);
                            }
                        })
                    }).then(function(dataReceived){
                        res.render('./display', {url:dataReceived.shortURL, message:'',  targetURL:dataReceived.originalURL});
                    }, function(badResponse){
                        throw badResponse;
                    })
                }
            }, function(errorResponse){
                throw errorResponse;
            })
        }
        else{
            //if invalid URL, tell user
            res.render('./display', {message:"Please enter valid URL", url:'', targetURL:''});
        }
    });
    
    //when user use the shortened link provided, redirect user to the original URL based on the ID provided
    app.get('/:id', function(req,res){
        new Promise((resolve, reject)=>{
            access.findInDB(req.params.id, function(err, data){
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        }).then(function(dataReturned){
                if(dataReturned!==null){
                    res.redirect(dataReturned.originalURL);
                }else{
                    res.render("./invalidResult");
                }
            }, function(errorResponse){
                throw errorResponse;
            });
    });
}