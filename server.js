var express = require('express');
var app = express();

//
// Add body parsing to the app
//

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true },{limit: '5mb'}));
app.use(bodyParser.json({limit: '5mb'}));

//
//Set up some routing
//

//Route /api requests to the APIRouter
var APIRouter = require('./routing/APIRouter.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', APIRouter);

//Route the rest of the requests to the static directory
app.use(express.static(__dirname + '/public'));

app.listen(3000, function() {
    console.log('Listening on port 3000...');
});
