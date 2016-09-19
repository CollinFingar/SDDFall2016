var express = require('express');
var app = express();

//
//Set up some routing
//

//Route /api requests to the APIRouter
var APIRouter = require('./APIRouter.js');
app.use('/api', APIRouter);

//Route the rest of the requests to the static directory
app.use(express.static(__dirname + '/public'));

app.listen(3000, function() {
    console.log('Listening on port 3000...');
});
