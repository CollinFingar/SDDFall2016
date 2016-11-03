// This is the main application.
var app = angular.module('theApp', []);

// This is an initial controller.
app.controller('theCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.tabTitles = ["Encyclopedia", "Collection", "Social", "Classifieds", "Pull-Rate"];
    $scope.encyclopediaEntries = [];
    $scope.encycPage = [];
    $scope.pageNum = 0;

    $http({
        method : "GET",
        url : "http://localhost:3000/api/all"
    }).then(function mySucces(response) {
		$scope.encyclopediaEntries = response.data;
		$scope.loadPage();
    }, function myError(response) {
        console.log('FAILURE');
    });
	$scope.nextPage = function() {
		$scope.pageNum++;
		$scope.loadPage();
	};
	$scope.previousPage = function() {
		if ($scope.pageNum != 0) {
			$scope.pageNum--;
			$scope.loadPage();
		}
	};
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

app.controller('loginCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.email = "generic@gener.ic";
    $scope.password = "password";
    // Asks server to sign in using current email and password
    $scope.signin = function(){
        console.log("Attempting Sign In");
        $scope.email = document.getElementById('loginUName').value;
        $scope.password = document.getElementById('loginPassword').value;
        $http({
            method : "POST",
            url : "http://localhost:3000/api/signin",
            data : JSON.stringify(
                {
                    username: $scope.email,
                    password: $scope.password
                }
            )
        }).then(function mySuccess(response) {
            console.log(response);
        }, function myError(response) {
            console.log(response);
        });
        document.getElementById('id01').style.display='none';
    };

    $scope.test = function(){
        alert("Test Success");
    };
    // Asks server to register using current email and password
    $scope.register = function(){
        console.log("Attempting Registration");
        $scope.email = document.getElementById('loginUName').value;
        $scope.password = document.getElementById('loginPassword').value;
        $http({
            method : "POST",
            url : "http://localhost:3000/api/register",
            data : JSON.stringify(
                {
                    username: $scope.email,
                    password: $scope.password
                }
            )
        }).then(function mySuccess(response) {
            console.log(response);
        }, function myError(response) {
            console.log(response);
        });
        document.getElementById('id01').style.display='none';
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
