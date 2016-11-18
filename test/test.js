var assert = require('assert');

//**************
//* Unit tests *
//**************

describe('credentialVerifyer', function() {
    var verifyer = require('../lib/credentialVerifyer.js');
    describe.only('#verify', function() {
        it('should return true when the username is a real email and the password is also correct', function() {
            var correctCredentials = {
                username:'thisisgoodemail@email.com',
                password:'wowthispasswordissogoodicanteven'
            };
            assert.equal(true, verifyer.verify(correctCredentials));
        });
        it('should return false when the username is not an email, but the password is correct', function() {
            var badEmailCredentials = {
                username:'thisisgoodemail@emailcom',
                password:'wowthispasswordissogoodicanteven'
            };
            assert.equal(false, verifyer.verify(badEmailCredentials));
        });
        it('should return false when the username is correct, but the password is incorrect', function() {
            var badPassCredentials = {
                username:'thisisgoodemail@email.com',
                password:'secure'
            };
            assert.equal(false, verifyer.verify(badPassCredentials));
        });
        it('should return false when both of the credentials are wrong', function() {
            var badCredentials = {
                username:'suckyemail@',
                password:'wow'
            };
            assert.equal(false, verifyer.verify(badCredentials));
        });
    });
});

describe('MongoManager', function() {
    var manager = require('../credentialVerifyer.js');
    describe('#connect()', function(done) {
        it('should get a Mongo connection', function() {
            manager.connect('mongodb://localhost:27017/card', function(err) {
                assert.equal(err, null);
                done();
            });
        });
        it('should properly cache the db connection', function(done) {
            assert.notEqual(manager.get(), null);
            done();
        });
        it('should be able to close the connection without error', function(done) {
            assert.notEqual(manager.close(), false);
            assert.equal(manager.get, null);
            done();
        });
    });
});
