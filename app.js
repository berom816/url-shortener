var express = require("express");
var app = express();

var route = require("./route.js");
//connect to mongoDB through mongoose
var mongoose = require("mongoose");

// require("dotenv").load();

//connect to DB
mongoose.connect(process.env.MONGOLAB_URI);

//serve static files
app.use(express.static('./public'));
app.use('/assets', express.static('assets'))

//use ejs for view engine
app.set('view engine', 'ejs');

route(app);

app.set('PORT', process.env.PORT || 8080);
app.listen(app.get('PORT'));
console.log('listening to port');
