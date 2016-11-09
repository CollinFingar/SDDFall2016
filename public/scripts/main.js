// This is the main application.
var app = angular.module('theApp', []);

// This controller handles most of the card databasing
app.controller('theCtrl', ['$scope', '$http', function($scope, $http) {
    // Names of each of the html tabs
    $scope.tabTitles = [
        "Encyclopedia",
        "Collection",
        "Social",
        "Classifieds",
        "Pull-Rate",
        "Card Reader"];
    // Will contain all of the card objects
    $scope.encyclopediaEntries = [];
    $scope.encycPage = [];
    $scope.pageNum = 0;

    // This gathers the entire encyclopedia of information upon initialization
    $http({
        method : "GET",
        url : "http://localhost:3000/api/all"
    }).then(function mySucces(response) {
		$scope.encyclopediaEntries = response.data;
		$scope.loadPage();
    }, function myError(response) {
        console.log('FAILURE');
    });
    // This gathers the next grouping of cards to display
	$scope.nextPage = function() {
		$scope.pageNum++;
		$scope.loadPage();
	};
    // This gathers the previous grouping of cards to display
	$scope.previousPage = function() {
		if ($scope.pageNum != 0) {
			$scope.pageNum--;
			$scope.loadPage();
		}
	};
    // This loads the image of each card in the current grouping
	$scope.loadPage = function() {
		localStorage.clear();
		var i = 0;
		$scope.encycPage = []; //clear previous page data
		for (x in $scope.encyclopediaEntries) {
			if (i < 16*($scope.pageNum)) {
				i++;
			}
			else if (i == 16*($scope.pageNum+1)) {
				break;
			}
			else {
				i++;
				$scope.encycPage.push($scope.encyclopediaEntries[x]);
			}
		}
		$scope.$apply;
	};
}]);

// This controller handles all of the account handling (signing in/registering)
app.controller('loginCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.email = "generic@gener.ic";
    $scope.password = "password";
    // Asks server to sign in using current email and password field values
    $scope.signin = function(){
        $http({
            method : "POST",
            url : "http://localhost:3000/api/signin",
            data : JSON.stringify(
                {
                    username: document.getElementById('loginUName').value,
                    password: document.getElementById('loginPassword').value
                }
            )
        }).then(function mySuccess(response) {
            // Upon success, this function happens
            $scope.email = document.getElementById('loginUName').value;
            $scope.password = document.getElementById('loginPassword').value;
            // Close the login/register pop up
            document.getElementById('id01').style.display='none';
        }, function myError(response) {
            // Upon failure, this function happens
            alert(response.data);
        });
        //When done

    };

    $scope.test = function(){
        alert("Test Success");
    };

    // Asks server to register using current email and password
    $scope.register = function(){
        $http({
            method : "POST",
            url : "http://localhost:3000/api/register",
            data : JSON.stringify(
                {
                    username: document.getElementById('loginUName').value,
                    password: document.getElementById('loginPassword').value
                }
            )
        }).then(function mySuccess(response) {
            // Upon success, this function happens
            $scope.email = document.getElementById('loginUName').value;
            $scope.password = document.getElementById('loginPassword').value;
            // Close the login/register pop up
            document.getElementById('id01').style.display='none';
        }, function myError(response) {
            // Upon failure, this function happens
            alert(response.data);
            console.log(response.data);
        });
    };

}]);

function main(){
    // This opens the encyclopedia as the default page.
    document.getElementById("enc").className += " active";
    document.getElementById("Encyclopedia").style.display = "block";
}

// Opens the page for a tab when it's clicked on.
function openTab(evt, section) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(section).style.display = "block";
    evt.currentTarget.className += " active";
}

main();
