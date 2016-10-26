// This is the main application.
var app = angular.module('theApp', []);

// This is an initial controller.
app.controller('loginCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.loadMainPage = function(){
        $window.location.href = '/main.html';
    }
}]);


function LogIn(){
    var email = document.getElementById('EmailField').value;
    var password = document.getElementById('PasswordField').value;
    alert(email + " " + password);
}
