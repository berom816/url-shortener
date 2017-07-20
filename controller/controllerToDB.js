var ShortURL = require("../model/shortURL.js");

//find the url inputted in the DB
module.exports.URLExistInDB = function(urlInput, callback){
    ShortURL.find({originalURL:urlInput}, function(err, data){
        if(err) throw err;
        if(data.length>0){
            callback(null, data[0]);   
        }
        callback(null, null);
    })
}

//save the url to the DB
module.exports.countAndSaveNewURL = function(urlInput, callback){
    ShortURL.count({}, function(err, elementCount){
        if(err) throw err;
        
        ShortURL({
            shortURL:"https://fast-chamber-82848.herokuapp.com/"+(1000+elementCount+1), 
            originalURL:urlInput,
            thisId:parseInt(1000+elementCount+1)
        }).save(function(err){
            if(err) throw err;
            
            ShortURL.find({originalURL:urlInput}, function(err, result){
                if(err) throw err;
                
                callback(null, result[0]);
            })
        })
    })
}

//find the id inputted in the DB
module.exports.findInDB = function(id, callback){
    ShortURL.find({thisId:id}, function(err, data){
        if(err) throw err;

        if(data.length>0){
            callback(null, data[0]);   
        }
        callback(null, null);
    })
}