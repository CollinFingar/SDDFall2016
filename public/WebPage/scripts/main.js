// This is the main application.
var app = angular.module('theApp', []);

// This is an initial controller.
app.controller('theCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.tabTitles = ["Encyclopedia", "Collection", "Social", "Classifieds", "Pull-Rate"];
    $scope.encyclopediaEntries = ["Pikachu", "Squirtle", "YourMom", "Charmander"];
	$scope.encycPage1 = [];
    $http({
        method : "GET",
        url : "http://localhost:3000/api/all"
    }).then(function mySucces(response) {

        $scope.encyclopediaEntries = response.data;
		var i = 0;
		for (x in $scope.encyclopediaEntries) {
			if (i == 16) {break;}
			i++;
			$scope.encycPage1.push($scope.encyclopediaEntries[x]);
		}
        //console.log($scope.encycPage1);
    }, function myError(response) {
        console.log('FAILURE');
    });
}]);

function main(){
    // This opens the encyclopedia as the default page.
    document.getElementById("enc").className += " active";
    document.getElementById("Encyclopedia").style.display = "block";
    $(document).ready( function() {
        $("#Encyclopedia").load("html/tabs/encyclopedia.html");
    });
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
