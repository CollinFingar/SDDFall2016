var assert = require('assert');

var verifyer = require('../lib/credentialVerifyer.js');
describe('credentialVerifyer', function() {
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

//Example test
// describe('Array', function() {
//     describe('#indexOf()', function() {
//         it('should return -1 when the value is not present', function() {
//             assert.equal(-1, [1,2,3].indexOf(4));
//         });
//     });
// });
