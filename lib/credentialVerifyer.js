//Checks if a username is a valid email
var verifyUsername = function(username) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(username);
};

//Checks if a password is a valid password
var verifyPassword = function(password) {
    return password.length >= 8;
};

//Check that a set of credentials is complete and meets requirements
exports.verify = function(credentials) {
    return (credentials.username && credentials.password && verifyUsername(credentials.username) && verifyPassword(credentials.password));
};
