// This is the main application.
var emailTextVar = "Not logged in";

var app = angular.module('theApp', []);

app.service('CollectionService', function(){
    var collection = {};
    var token = "noToken";
    return {
        getCollection: function(){
            console.log("Getting Colelction");
            return collection;
        },
        setCollection: function(newCollection){
            console.log("Setting Colelction");
            collection = newCollection;
        },
        getToken: function(){
            console.log("Getting Token");
            return token;
        },
        setToken: function(newToken){
            console.log("Setting Token");
            token = newToken;
        }
    };

});


// This controller handles most of the card databasing
app.controller('theCtrl', ['$scope', '$http', 'CollectionService', function($scope, $http, CollectionService) {
    // Names of each of the html tabs
    $scope.tabTitles = [
        "Encyclopedia",
        "Collection",
        "Pull-Rate",
        "Card Reader"];
    // Will contain all of the card objects
    $scope.encyclopediaEntries = [];
	$scope.currentData = []; //current source of data page display is pulling from
    $scope.cardPage = [];
    $scope.pageNum = 0;
	$scope.currentCard;

    $scope.addSearchResults = [];
	$scope.searchResults = [];
    $scope.userCollection = {}

    // This gathers the entire encyclopedia of information upon initialization
    $http({
        method : "GET",
        url : "http://localhost:3000/api/all"
    }).then(function mySucces(response) {
		$scope.encyclopediaEntries = response.data;
		$scope.loadSearchResults("encyclopedia");
        console.log(response.data);
    }, function myError(response) {
        console.log('FAILURE');
    });
    // This gathers the next grouping of cards to display
	$scope.nextPage = function() {
		$scope.pageNum++;
		$scope.loadSearchResults();
	};
    // This gathers the previous grouping of cards to display
	$scope.previousPage = function() {
		if ($scope.pageNum != 0) {
			$scope.pageNum--;
			$scope.loadSearchResults();
		}
	};
	/*
    // This loads the image of each card in the current grouping
	$scope.loadPage = function() {
		localStorage.clear();
		var i = 0;
		$scope.cardPage = []; //clear previous page data
		for (x in $scope.encyclopediaEntries) {
			if (i < 24*($scope.pageNum)) {
				i++;
			}
			else if (i == 24*($scope.pageNum+1)) {
				break;
			}
			else {
				i++;
				$scope.cardPage.push($scope.encyclopediaEntries[x]);
			}
		}
		$scope.$apply;
	};
	*/
    // This loads the image of each card in a returned search
	$scope.loadSearchResults = function(type) {
		if (type == "keyword") {
			$scope.currentData = $scope.searchResults;
		} else if (type == "encyclopedia") {
			$scope.currentData = $scope.encyclopediaEntries;
		}
		localStorage.clear();
		var i = 0;
		$scope.cardPage = []; //clear previous page data
		for (x in $scope.currentData) {
			if (i < 24*($scope.pageNum)) {
				i++;
			}
			else if (i == 24*($scope.pageNum+1)) {
				break;
			}
			else {
				i++;
				$scope.cardPage.push($scope.currentData[x]);
			}
		}
		$scope.$apply;
	};
	// This returns all relevant card data for the card that was clicked
	$scope.cardData = function(card) {
		$scope.currentCard = card; //attach currentCard to correct card data
		openTab(event,'Card');
	};
	// This checks if a field is empty or not in the JSON to run html code accordingly
	$scope.checkField = function(name,type) {
		if (name == null) {
			return false;
		} else {
			return true;
		}
	};

    $scope.searchKeyword = function(searchType){
		var value;
		if (searchType == "encyclopedia") {
			value = document.getElementById("searchBarEncyclopedia").value;
		}
		var value = value.replace(" ","+");
		console.log(value);
        $http({
            method : "GET",
            url : "http://localhost:3000/api/keysearch/" + value
        }).then(function mySuccess(response) {
            console.log(response);
			$scope.pageNum = 0;
    		$scope.searchResults = response.data;
			$scope.loadSearchResults("keyword");
        }, function myError(response) {
            console.log(response);
        });
    };

    $scope.retrieveCollection = function(){
        $scope.userCollection = CollectionService.getCollection();
    };

    $scope.addCardToCollection = function(){
        var type = document.getElementById('cardType').value;
        var amount = document.getElementById('cardAmount').value;
        if(CollectionService.getToken() != "noToken"){
            var cardid = $scope.currentCard.id;
            var cards = {};
            var card = {};
            card[type] = parseInt(amount);
            cards[cardid] = card;
            console.log(cards);

            $http({
                method : "POST",
                url : "http://localhost:3000/api/user/collection",
                data : JSON.stringify(
                    {
                        token : CollectionService.getToken(),
                        cards : cards
                    }
                )
            }).then(function mySuccess(response) {
                // Upon success, this function happens
                console.log("ADD CARD: SUCCESS");
                console.log(response);

            }, function myError(response) {
                // Upon failure, this function happens
                console.log("ADD CARD: FAILURE");
                console.log(response);

            });
        }
    };
}]);

// This controller handles all of the account handling (signing in/registering)
app.controller('loginCtrl', ['$scope', '$http', 'CollectionService', function($scope, $http, CollectionService) {
    $scope.email = "";
    $scope.password = "";

    $scope.token = "noToken";
    $scope.emailText = "Not logged in";
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
            $scope.emailText = document.getElementById('loginUName').value;
            $scope.token = response.data.token;
            $scope.accessCollection();
            CollectionService.setToken($scope.token);
            console.log($scope.token);
            // Close the login/register pop up
            document.getElementById('id01').style.display='none';
        }, function myError(response) {
            // Upon failure, this function happens
            $scope.emailText = "Not logged in.";
            $scope.token = "noToken";
            CollectionService.setToken($scope.token);
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
            $scope.emailText = document.getElementById('loginUName').value;
            $scope.token = response.data.token;
            CollectionService.setToken($scope.token);
            // Close the login/register pop up
            document.getElementById('id01').style.display='none';
        }, function myError(response) {
            // Upon failure, this function happens
            $scope.emailText = "Not logged in.";
            $scope.token = "noToken";
            CollectionService.setToken($scope.token);
        });
    };


    // Asks server to register using current email and password
    $scope.accessCollection = function(){
        console.log("Token " + $scope.token);
        $http({
            method : "GET",
            url : "http://localhost:3000/api/user/collection",
            headers :
                {
                    "Token": $scope.token
                }

        }).then(function mySuccess(response) {
            // Upon success, this function happens
            console.log(response);
            console.log("COLLECTION ACCESS: SUCCESS");
        }, function myError(response) {
            // Upon failure, this function happens
            console.log(response);
            console.log("COLLECTION ACCESS: FAILURE");
        });
    };

    $scope.logOut = function(){
        $scope.email = "";
        $scope.password = "";
        $scope.token = "noToken";
        $scope.emailText = "Not logged in";
        emailTextVar = "Not logged in";
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
