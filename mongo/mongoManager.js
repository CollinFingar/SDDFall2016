var MongoClient = require('mongodb').MongoClient;

var connection = {
    db: null
};

exports.connect = function(url, callback) {
    if (connection.db) return;

    MongoClient.connect(url, function(err, db) {
        if (err) return callback(err);
        connection.db = db;
        return callback();
    });
};

exports.get = function() {
    return connection.db;
};

exports.close = function(callback) {
    if (connection.db) {
        connection.db.close(function(err, result) {
            connection.db = null;
            connection.mode = null;

            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    }
    else {
        callback(true);
    }
};
