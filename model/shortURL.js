var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//create schema for db items
var shortURLSchema = new mongoose.Schema({
    shortURL:String,
    originalURL:String, 
    thisId:Number
});

//create db model
module.exports = mongoose.model('shortURL',shortURLSchema);