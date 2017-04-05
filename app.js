var express = require("express");
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var validURL = require("./checkValidURL");

//connect to mongoDB through mongoose
var mongoose = require("mongoose");
//hold the link to mongodb from configuration in heroku
var dbURL = process.env.MONGOLAB_URI;
mongoose.connect(dbURL);

//create schema for db items
var shortURLSchema = new mongoose.Schema({
    shortURL:String,
    originalURL:String, 
    id:Number
});

//create db model
var CondenseLink = mongoose.model('CondenseLink',shortURLSchema);

//serve static files
app.use(express.static('./public'));
app.use('/assets', express.static('assets'))

//use ejs for view engine
app.set('view engine', 'ejs');

//render main page
app.get('/',function(req,res){
    res.render('./display',{url:'',message:'',targetURL:'#'});
});

//post request with the url entered as data
app.post('/',urlencodedParser,function(req,res){
    //holds what's enter by the user
    var holdReqBody = req.body;
    //check if it's an acceptable format of url
    if(validURL.checkValidURL(holdReqBody.urlInput)){
        //search db to see if exact same url exists in the db already
        var _newURL = CondenseLink.find({originalURL:holdReqBody.urlInput}, function(err, data){
            if(err) throw err;
            //if found in db, display the shortened url from db
            if(data.length>0){
                res.render('./display', {url:data[0].shortURL, message:'',targetURL:data[0].originalURL});
            }
            else{
                //if not found in db, get a count of datas in db for setting ID number
                CondenseLink.count({}, function(err, elementCount){
                    if(err) throw err;
                    //create the data in db, ID being count of data in db + 1
                    CondenseLink({
                        shortURL:"https://fast-chamber-82848.herokuapp.com/"+(1000+elementCount+1), 
                        originalURL: holdReqBody.urlInput,
                        id:1000+elementCount+1
                    }).save(function(err) {
                        if(err)throw err;
                        //display the newly added data's shortURL to use
                        CondenseLink.find({originalURL:holdReqBody.urlInput}, function(err, data){
                            if(err) throw err;
                            res.render('./display', {url:data[0].shortURL, message:'', targetURL:data[0].originalURL});
                        });
                    });
                });
            }
        });
    }
    else{
        //if invalid URL, tell user
        res.render('./display', {message:"Please enter valid URL", url:'', targetURL:''});
    }
});

//when user use the shortened link provided, redirect user to the original URL based on the ID provided
app.get('/:id', function(req,res){
    //find if ID exist in db
    CondenseLink.find({id:Number(req.params.id)},function(err, data){
        if(err) throw err;
        //if ID exist in db, redirect user to original URL from the ID provided
        if(data.length>0){
            res.redirect(data[0].originalURL);
        }
        //if ID doesn't exist in db, display invalid result 
        else{
            res.render("./invalidResult");
        }
    })
})

app.set('PORT', process.env.PORT || 8080);
app.listen(app.get('PORT'));
console.log('listening to port');
