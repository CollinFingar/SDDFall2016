var app = angular.module('theApp', []);
app.controller('theCtrl', function($scope) {
    $scope.firstName= "John";
    $scope.lastName= "Doe";
    $scope.tabTitles = ["Encyclopedia", "Collection", "Social", "Classifieds", "Pull-Rate"];
});

function main(){
    document.getElementById("enc").className += " active";
    document.getElementById("Encyclopedia").style.display = "block";
    $(document).ready( function() {
        $("#Encyclopedia").load("html/encyclopedia.html");
    });
}

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
