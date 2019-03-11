// Firebase Configuration & initialization
//
var config = {
  apiKey: "AIzaSyAetjyRx2t2a0mBfY0XwsSpH-2RclTWfeI",
  authDomain: "flawless-7a98a.firebaseapp.com",
  databaseURL: "https://flawless-7a98a.firebaseio.com",
  projectId: "flawless-7a98a",
  storageBucket: "flawless-7a98a.appspot.com",
  messagingSenderId: "1096240112468"
};
firebase.initializeApp(config);

var database = firebase.database();

//   Namita
//
//
//
//
//
//   Sophie
//
//
//
//

// Kanwar
//
//

$(document).ready(function() {
  
function invokeInputForm() {
  
    // Create the Form 
    var containerDiv = $("<div>").addClass("container float-left");
    var inputForm = $("<form>");
    // Input field for Search location by Zipcode or City
    var locationFormDiv = $("<div>").addClass("form-group");
    locationFormDiv.append("<label for='location'> Search by location: </label>" );
    locationFormDiv.append("<input type='text' id='location' class='form-control'>");
   
    // Input field for Restaurants and other places to meet
    var foodFormDiv = $("<div>").addClass("form-group");
    foodFormDiv.append("<label for='foodAndDrinks'> What Cuisine : </label>" );
    foodFormDiv.append("<input type='text' id='foodAndDrinks' placeholder='Eg Asian, American, French, Italian, Indian' class='form-control'>");

    // Input field for field of interest
    var moviesFormDiv = $("<div>").addClass("form-group");
    moviesFormDiv.append("<label for='moviesUpdate'> Entertainment updates : </label>" );
    moviesFormDiv.append("<input type='text' id='moviesUpdate' placeholder='Eg Name of Movie or TV Shows' class='form-control'>");

      // Input field for field of interest
      var newsFormDiv = $("<div>").addClass("form-group");
      newsFormDiv.append("<label for='newsUpdate'> News updates : </label>" );
      newsFormDiv.append("<input type='text' id='newsUpdate' placeholder='Eg Industry, Travel, Movie , Sports, Science' class='form-control'>");
  

    inputForm.append(locationFormDiv,foodFormDiv,moviesFormDiv,newsFormDiv);
   
    var submitButton = $("<button>").addClass("btn btn-success m-3 float-right").attr("id", "btn-submit").attr("type","submit").text("Submit");
    var clearButton =  $("<button>").addClass("btn btn-warning m-3 float-right").attr("id", "btn-clear").text("Clear");
    
    $("#input-form").append(inputForm, submitButton, clearButton);
    $(containerDiv).append("#input-form");

    $(document).on("click", "button[type=submit]", function (event) {
      event.preventDefault();
      alert("pressed Submit");
      saveToFirebase();
    });
}
 
  function saveToFirebase() {
    // store the value entered in form into variables
     var location = $("#location").val().trim();
     var foodAndDrinks = $("#foodAndDrinks").val().trim();
     var moviesUpdate = $("#moviesUpdate").val().trim();
     var newsUpdate = $("#newsUpdate").val().trim();

      var newSearchStored={
           location: location,
           foodAndDrinks: foodAndDrinks,
           moviesUpdate: moviesUpdate,
           newsUpdate: newsUpdate
      };

      database.ref().push(newSearchStored);

  }

$(".fas").on("click", function(event) {
    event.preventDefault();
    invokeInputForm();
});


})
