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
    console.log('Request received');
    console.log('Request URL:' + req.url); //The url given without query params or /api
    console.log('Request path:' + req.path); //The url with query params but no /api
    console.log('Request Method:' + req.method); //The verb used in the request e.g. GET, PUT, POST, DELETE
    console.log('Request Query:' + JSON.stringify(req.query) + '\n'); //The JSON of the parsed query params
    console.log('Request Body:' + req.body + '\n');
    next();
});


/****
*
* Routing that relates to user authentication
*
****/

//Get the token library
var jwt = require('jsonwebtoken');

//Get the credential checker library
var credentialVerifyer = require('../lib/credentialVerifyer');

var authenticationKey = "a very nice key";

router.route('/register')
    .post(function(req, res, next) {
        //Get the users collection from Mongo
        var users = mongoManager.get().collection('users');

        //Check if the requested username already exists
        users.findOne( { 'username':req.body.username, 'password':req.body.password }, function(err, result) {
            if (err) {
                res.status(500);
                res.send('Internal server error. The request could not be handled.');
            }

            if (result) {
                res.status(409);
                res.send('The username already exists');
            }

            else {
                //Check if the password is sane
                if (credentialVerifyer.verify(req.body)) {
                    //Create the user and respond with a success
                    users.insertOne( { 'username':req.body.username,
                                        'password':req.body.password,
                                        'cards':{},
                                        'friends':[],
                                        'bio':'I want to be the very best!' } , function(err, r) {
                        if (err) {
                            res.status(500);
                            res.send('Internal server error. The account could not be created');
                        }

                        res.status(201);
                        res.send('The user account has been created.');
                    });
                }
                //The credentials are wrong
                else {
                    res.status(422);
                    res.send('The login information was improperly formed.');
                }
            }
        });
    });

router.route('/signin')
    .post(function(req, res, next) {
        //Check if the req has a valid username and password
        if (req.body.username && req.body.password) {
            //Put the data into a var
            var user = {
                'username':req.body.username,
                'password':req.body.passowrd
            };
            //Get the mongo users collection
            var users = mongoManager.get().collection('users');
            //Search for the username and password
            users.findOne( user, function(err, result) {
                if (err) {
                    res.status(500);
                    res.send('Error validating credentials.');
                }

                //Create a token to give to the client
                var token = jwt.sign(user, authenticationKey, {
                    expiresIn: 600 // expires in 10 hours
                });

                res.setHeader('Content-Type', 'application/json');
                res.json({
                    'token':token
                });
            });
        }
        else {
            res.status(400);
            res.send('Error: The credentials were not well formed.');
        }
    });

//Middleware to ensure that the user is signed in
router.route('/user', function(req, res, next) {
    //Check if the token is a valid token
    if (res.body.token) {
        var checkToken = res.body.token;

        jwt.verify(token, authenticationKey, function(err, decoded) {
            if (err) {
                res.status(500);
                res.send('Invalid access.');
            }

            //Congratulations on being in the VIP club

            //Store the decoded credentials for use later in the route
            req.decoded = decoded;
            next();
        });
    }
    else {
        res.status(500);
        res.send('No token found.');
    }
});

router.route('/user/collection')
    .get(function(req, res, next) {

    })
    .post(function(req, res, next) {

    });

/****
*
* Routing that requires no authentication
*
****/

//A query that is shared between various get calls
queryBasic = function(query, res) {
    var cards = mongoManager.get().collection('pokemon');
    var responseJSON = { };
    cards.find( query ).sort( { 'name':1 } ).each(function(err, doc) {
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
        var cursor = cards.find( { 'id':req.params.id } );
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
        cards.find( { 'setCode':req.params.id } ).sort( { 'number':1 } ).each(function(err, doc) {
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
