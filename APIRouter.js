//Attempt to connect to the mongo database
var mongoManager = require('./mongoManager');
var assert = require('assert');

mongoManager.connect('mongodb://localhost:27017/card', function(err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    }
    else {
        console.log('Mongo connection established successfully');
    }
});

//Initialize the express router
var express = require('express');
var router = express.Router();

router.route('/')
    //Middleware to log any requests
    .all(function(req, res, next) {
        console.log("Request received");
        console.log("Request URL:" + req.url); //The url given without query params or /api
        console.log("Request path:" + req.path); //The url with query params but no /api
        console.log("Request Method:" + req.method); //The verb used in the request e.g. GET, PUT, POST, DELETE
        console.log("Request Query:" + JSON.stringify(req.query) + "\n"); //The JSON of the parsed query params
        console.log("Request Body:" + req.body + "\n");
        next();
    })
    //Parse build and return a request
    .get(function(req, res, next) {
        var cards = mongoManager.get().collection('pokemon');
        cards.find().each(function(err, doc) {
            //If there is data to write
            if (!err && (doc !== null)) {
                var card = {
                    id: doc.id,
                    name: doc.name,
                    set: doc.set
                };
                res.write(JSON.stringify(card));
            }
            //If the cursor has reached the end of its data
            else if (doc === null) {
                res.end();
            }
        });
    });

module.exports = router;
