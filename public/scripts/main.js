// This is the main application.
var emailTextVar = "Not logged in";
var lastPage = "Encyclopedia";

var app = angular.module('theApp', []);

app.service('CollectionService', function(){
    var collection = {};
    var token = "noToken";
    return {
        getCollection: function(){
            return collection;
        },
        setCollection: function(newCollection){
            collection = newCollection;
        },
        getToken: function(){
            return token;
        },
        setToken: function(newToken){
            token = newToken;
        },
        isSignedIn: function(){
            if(token == "noToken"){
                return false;
            }
            return true;
        }
    };

});

// This controller handles most of the card databasing
app.controller('theCtrl', ['$scope', '$http', '$interval', 'CollectionService', function($scope, $http, $interval, CollectionService) {
    // Names of each of the html tabs
    $scope.tabTitles = [
        "Encyclopedia",
        "Collection"];
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
    }, function myError(response) {
    });
    // This gathers the next grouping of cards to display
	$scope.nextPage = function() {
		$scope.loadSearchResults("next");
	};
    // This gathers the previous grouping of cards to display
	$scope.previousPage = function() {
		if ($scope.pageNum != 0) {
			$scope.loadSearchResults("previous");
		}
	};
    // This loads the image of each card in a returned search
	$scope.loadSearchResults = function(type) {
		if (type == "keyword") {
			$scope.currentData = $scope.searchResults;
		} else if (type == "encyclopedia") {
			$scope.currentData = $scope.encyclopediaEntries;
		} else if (type == "next") {
			$scope.pageNum++;
		} else if (type == "previous") {
			$scope.pageNum--;
		} else if(type == "collection"){
            $scope.currentData = $scope.userCollection;
        }
		localStorage.clear();
		var i = 0;
		var pageBackup = $scope.cardPage;
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
		if ($scope.cardPage.length == 0) {
			if (type == "next" || type == "previous") {
				$scope.cardPage = pageBackup;
				if (type == "next") {
					$scope.pageNum--;
				} else if (type == "previous") {
					$scope.pageNum++;
				}
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
            value = value.replace(" ","+");
            $http({
                method : "GET",
                url : "http://localhost:3000/api/keysearch/" + value
            }).then(function mySuccess(response) {
                $scope.pageNum = 0;
                $scope.searchResults = response.data;
                $scope.loadSearchResults("keyword");
            }, function myError(response) {

            });
		} else if(searchType == "collection"){
            value = document.getElementById("searchBarCollection").value;
            value = value.replace(" ","+");
            $http({
                method : "GET",
                url : "http://localhost:3000/api/user/collection/keysearch/" + value,
                headers :
                    {
                        "Token": CollectionService.getToken()
                    }
            }).then(function mySuccess(response) {
                $scope.pageNum = 0;
                $scope.searchResults = response.data;
                $scope.loadSearchResults("keyword");
            }, function myError(response) {

            });
        }

    };

    $scope.retrieveCollection = function(){
        $scope.userCollection = CollectionService.getCollection();
        $scope.$apply;
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
                document.getElementById('id03').style.display='none';
            }, function myError(response) {
                // Upon failure, this function happens

            });
        }
    };

    $scope.deleteCardFromCollection = function(){

        var type = document.getElementById('DcardType').value;
        var amount = document.getElementById('DcardAmount').value;
        if(CollectionService.getToken() != "noToken"){
            console.log("DELETING");
            var cardid = $scope.currentCard.id;
            var cards = {};
            var card = {};
            card[type] = parseInt(amount);
            cards[cardid] = card;

            console.log(cards);
            console.log(CollectionService.getToken());
            $http({
                method : "DELETE",
                url : "http://localhost:3000/api/user/collection",
                data :
                    {
                        cards : cards
                    },
                headers :
                    {
                        "Token" : CollectionService.getToken(),
                        "Content-Type": "application/json;charset=utf-8"
                    }

            }).then(function mySuccess(response) {
                // Upon success, this function happens
                console.log(response);
                console.log("Success");
                document.getElementById('id04').style.display='none';
                openTab(event,'Collection');
            }, function myError(response) {
                // Upon failure, this function happens
                console.log(response);
                console.log("Failure");
            });
        }
    };

    $scope.isSignedIn = function(){
        return CollectionService.isSignedIn();
    };

    $scope.openAddCardModal = function(){
        if($scope.isSignedIn()){
            document.getElementById('id03').style.display='block';
        }
    };

    $scope.openDeleteCardModal = function(){
        if($scope.isSignedIn()){
            document.getElementById('id04').style.display='block';
        }
    };

    $interval(function() {
        //if($scope.userCollection != CollectionService.getCollection()){
            $scope.retrieveCollection();
            console.log($scope.userCollection);
        //} else {
        //}
    }, 2500);
}]);

// This controller handles all of the account handling (signing in/registering)
app.controller('loginCtrl', ['$scope', '$http', '$interval', 'CollectionService', function($scope, $http, $interval, CollectionService) {
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
            // Close the login/register pop up
            document.getElementById('id01').style.display='none';
        }, function myError(response) {
            // Upon failure, this function happens
            $scope.emailText = "Not logged in";
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
            $scope.emailText = "Not logged in";
            $scope.token = "noToken";
            CollectionService.setToken($scope.token);
        });
    };


    // Asks server to register using current email and password
    $scope.accessCollection = function(){
        $http({
            method : "GET",
            url : "http://localhost:3000/api/user/collection",
            headers :
                {
                    "Token": $scope.token
                }

        }).then(function mySuccess(response) {
            // Upon success, this function happens
            CollectionService.setCollection(response.data);
        }, function myError(response) {
            // Upon failure, this function happens
        });
    };

    $scope.logOut = function(){
        $scope.email = "";
        $scope.password = "";
        $scope.token = "noToken";
        $scope.emailText = "Not logged in";
        emailTextVar = "Not logged in";
        CollectionService.setCollection({});
    };

    $interval(function() {
        if($scope.token != "noToken"){
            $scope.accessCollection();
        } else {
        }
    }, 5000 );

}]);

function main(){
    // This opens the encyclopedia as the default page.
    document.getElementById("enc").className += " active";
    document.getElementById("Encyclopedia").style.display = "block";
}

function returnToLastPage(evt){
    openTab(evt, lastPage);

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

    if(section == 'Card'){
        if(lastPage == "Encyclopedia"){
            document.getElementById("deleteCardButton").style.display = "none";
        } else if(lastPage == "Collection"){
            document.getElementById("deleteCardButton").style.display = "initial";
        }
    }
    if(section == "Encyclopedia"){
        lastPage = section;
    } else if(section == "Collection"){
        lastPage = section;
    }
}
main();
