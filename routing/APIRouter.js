//Attempt to connect to the mongo database
var mongoManager = require('../mongo/mongoManager');
var assert = require('assert');

mongoManager.connect('mongodb://localhost:27017/card', function(err) {
    if (err) {
        console.log('Error: Unable to connect to Mongo.');
        process.exit(1);
    }
    else {
        console.log('Mongo connection established successfully');
    }
});

//Initialize the express router
var express = require('express');
var router = express.Router();

//Middleware to log any requests
router.use(function(req, res, next) {
    console.log("Request received");
    console.log("Request URL:" + req.url); //The url given without query params or /api
    console.log("Request path:" + req.path); //The url with query params but no /api
    console.log("Request Method:" + req.method); //The verb used in the request e.g. GET, PUT, POST, DELETE
    console.log("Request Query:" + JSON.stringify(req.query) + "\n"); //The JSON of the parsed query params
    console.log("Request Body:" + req.body + "\n");
    next();
});

//A query that is shared between various get calls
queryBasic = function(query, res) {
    var cards = mongoManager.get().collection('pokemon');
    var responseJSON = { };
    cards.find( query ).sort( { "name":1 } ).each(function(err, doc) {
        //If there is data to write
        if (!err && (doc !== null)) {
            responseJSON[doc.id] = {
                name: doc.name,
                set: doc.set
            };
        }
        //If the cursor has reached the end of its data
        else if (doc === null) {
            res.setHeader('Content-Type', 'application/json');
            res.json(responseJSON);
        }
    });
};

//Return a set of all of the cards
router.route('/all')
    .get(function(req, res, next) {
        queryBasic({}, res);
    });

//Do custom queries based on the query parameters
router.route('/search')
    .get(function  (req, res, next) {
        queryBasic(req.query, res);
    });

//Return a single card
router.route('/card/:id')
    .get(function(req, res, next) {
        var cards = mongoManager.get().collection('pokemon');
        var cursor = cards.find( { "id":req.params.id } );
        cursor.nextObject(function(err, item) {
            if (err) {
                res.status(504).send('Internal Server Error');
            }
            else if (!item) {
                res.status(404).send('Card not found');
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.json(item);
            }
        });
    });

//Return info about a set of cards
router.route('/set/:id')
    .get(function(req, res, next) {
        var cards = mongoManager.get().collection('pokemon');
        var responseJSON = { };
        cards.find( { "setCode":req.params.id } ).sort( { "number":1 } ).each(function(err, doc) {
            //If there is data to write
            if (!err && (doc !== null)) {
                responseJSON[doc.id] = doc;
            }
            //If the cursor has reached the end of its data
            else if (doc === null) {
                res.setHeader('Content-Type', 'application/json');
                res.json(responseJSON);
            }
        });
    });

//Route 404 for the rest of the requests
router.use(function(req, res, next) {
  res.status(404).send('404 Page Not Found!');
});

module.exports = router;
