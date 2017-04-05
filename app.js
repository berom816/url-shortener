var express = require("express");
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var validURL = require("./checkValidURL");

var mongoose = require("mongoose");
//hold the link to mongodb
var dbURL = process.env.MONGOLAB_URI;
mongoose.connect(dbURL);

//create schema for db items
var shortURLSchema = new mongoose.Schema({
    shortURL:String,
    originalURL:String, 
    id:Number
});

//create model
var CondenseLink = mongoose.model('CondenseLink',shortURLSchema);

app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.get('/',function(req,res){
    res.render('./display',{url:'',message:'',targetURL:'#'});
});

app.post('/',urlencodedParser,function(req,res){
    //holds what's enter by the user
    var holdReqBody = req.body;
    if(validURL.checkValidURL(holdReqBody.urlInput)){
        var _newURL = CondenseLink.find({originalURL:holdReqBody.urlInput}, function(err, data){
            if(err) throw err;
            
            if(data.length>0){
                res.render('./display', {url:data[0].shortURL, message:'',targetURL:data[0].originalURL});
            }
            else{
                CondenseLink.count({}, function(err, elementCount){
                    if(err) throw err;
                    CondenseLink({
                        shortURL:"https://url-shortener-ndosm2017.c9users.io/"+(1000+elementCount+1), 
                        originalURL: holdReqBody.urlInput,
                        id:1000+elementCount+1
                    }).save(function(err) {
                        if(err)throw err;
                        
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
        res.render('./display', {message:"Please enter valid URL", url:'', targetURL:''});
    }
});

app.get('/:id', function(req,res){
    CondenseLink.find({id:Number(req.params.id)},function(err, data){
        if(err) throw err;
        if(data.length>0){
            res.redirect(data[0].originalURL);
        }
        else{
            res.send("Invalid ID");
        }
    })
})

app.set('PORT', process.env.PORT || 8080);
app.listen(app.get('PORT'));
console.log('listening to port');
