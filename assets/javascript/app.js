// -------------------------------------------------------
// Firebase Configuration & initialization
//--------------------------------------------------------

var config = {
  apiKey: "AIzaSyAetjyRx2t2a0mBfY0XwsSpH-2RclTWfeI",
  authDomain: "flawless-7a98a.firebaseapp.com",
  databaseURL: "https://flawless-7a98a.firebaseio.com",
  projectId: "flawless-7a98a",
  storageBucket: "flawless-7a98a.appspot.com",
  messagingSenderId: "1096240112468"
};

firebase.initializeApp(config);

// ------------------------------------------------------
// Variables (if needed)
//----------------------------------------------------------

  var database = firebase.database();


// ------------------------------------------------------
// Functions
//--------------------------------------------------------
// function to display the input form
function invokeInputForm() {

  // Create the Form within a container
  var containerDiv = $("<div>").addClass("container float-left");
  var inputForm = $("<form>");

  // Input field for Search location by Zipcode or City
  var locationFormDiv = $("<div>").addClass("form-group");
  locationFormDiv.append("<label for='location'> Search by location: </label>");
  locationFormDiv.append("<input type='text' id='location' class='form-control'>");

  // Input field for Restaurants and other places to meet
  var foodFormDiv = $("<div>").addClass("form-group");
  foodFormDiv.append("<label for='foodAndDrinks'> What Cuisine : </label>");
  foodFormDiv.append("<input type='text' id='foodAndDrinks' placeholder='Eg Asian, American, French, Italian, Indian' class='form-control'>");

  // Input field for news if want latest news 
  var moviesFormDiv = $("<div>").addClass("form-group");
  moviesFormDiv.append("<label for='moviesUpdate'> Entertainment updates : </label>");
  moviesFormDiv.append("<input type='text' id='moviesUpdate' placeholder='Eg Name of Movie or TV Shows' class='form-control'>");

  // Input field for movies or TV Shows if wants info 
  var newsFormDiv = $("<div>").addClass("form-group");
  newsFormDiv.append("<label for='newsUpdate'> News updates : </label>");
  newsFormDiv.append("<input type='text' id='newsUpdate' placeholder='Eg Industry, Travel, Movie , Sports, Science' class='form-control'>");

  // append those input fields to the input form
  inputForm.append(locationFormDiv, foodFormDiv, moviesFormDiv, newsFormDiv);

  // create the buttons to submit or to clear the textbox fields
  var submitButton = $("<button>").addClass("btn btn-success m-3 float-right").attr("id", "btn-submit").attr("type", "submit").text("Submit");
  var clearButton = $("<button>").addClass("btn btn-warning m-3 float-right").attr("id", "btn-clear").text("Clear");

  // append the input form and the button to the container div created above
  containerDiv.append(inputForm, submitButton, clearButton);
  // append the input fields and button to the HTML section with ID = input-form
  $("#input-form").append(containerDiv); 

}

// function to save the user input into the firebase
function saveToFirebase() {

  // store the value entered in form into variables
  var location = $("#location").val().trim();
  var foodAndDrinks = $("#foodAndDrinks").val().trim();
  var moviesUpdate = $("#moviesUpdate").val().trim();
  var newsUpdate = $("#newsUpdate").val().trim();

  // create a temporary object 
  var newSearchStored = {
    location: location,
    foodAndDrinks: foodAndDrinks,
    moviesUpdate: moviesUpdate,
    newsUpdate: newsUpdate
  };

  // push this temporary object into firebase for storage
  database.ref().push(newSearchStored);

}

// ------------------------------------------------------------
// Main process

// get the HTML ready
$(document).ready(function () {

  // display the input form when an icon has been cliked
  $(".btn-to-get-form").on("click", invokeInputForm);

  // when the "clear" button has been clicked..
  $(document).on("click", "#btn-clear", function() {

    location = $("#location").val("");
    foodAndDrinks = $("#foodAndDrinks").val("");
    moviesUpdate = $("#moviesUpdate").val("");
    newsUpdate =  $("#newsUpdate").val("")
  })

  // when the "submit" button has been clicked...
  
  $(document).on("click", "button[type=submit]", function (event) {


    event.preventDefault();

    // save the user input to firebase 
    saveToFirebase();

    // do the AJAX calls
    var place = $("#location").val().trim(); 
    var cuisine = $("#foodAndDrinks").val().trim(); 
    

     // Some APIs will give us a cross-origin (CORS) error. This small function is a fix for that error. You can also check out the chrome extenstion (https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en).
     jQuery.ajaxPrefilter(function (options) {
      if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
      }
    });

    //Geenrating the API query by passing the location to it 
    var queryURL = "https://api.yelp.com/v3/businesses/search?term=resturants&limit=20&sort_by=rating&location=" +  place; 

    //YELP API we need to pass Authorization as a part of the header for the link to work 
    $.ajax({
        url: queryURL,
        method: "GET",
        dataType: "json",
        headers: {
            Authorization: "Bearer 6pKp-wZ6h5uoiUqasnagzsVJuleZkEyFSWPJhzSyyiSj8Ha__4PCt_15sDAEufe1_7x0-aCz_tfxz96hkRdPxL6GtP5QyOzJ9A1yOlRiVSORiFstD9P1MT0J6m6EXHYx",
        }
    }).then(function(response) {
        // console.log("queryURL" + queryURL); 
        console.log(response);

        for ( var i =0; i < response.businesses.length ; i++){
          var newDiv = $("<div>"); 
          // console.log("State: " + response.businesses[i].location.state); 
          // console.log("Category :" + response.businesses[i].categories[0].title); 
          // console.log("Name : "  + response.businesses[i].name); 

          newDiv.append("<h3 class='title'>"+ response.businesses[i].name + "</h3>"); 
          newDiv.append("<p> Category : "+ response.businesses[i].categories[0].title + "</p>"); 
          
          newDiv.append("<p> Price : "+ response.businesses[i].price  + " Reviews: " + response.businesses[i].review_count + "</p>");
          newDiv.append("<p>  Ratings: " + response.businesses[i].rating +"</p>"); 
          newDiv.append("<a href="+ response.businesses[i].url + " target='_blank'> Yelp Business Link </a>")
          
          newDiv.append("<hr />"); 
          newDiv.append("</div>"); 
          
          // By now, you should have been able to render all of the resturants to the foods & drinks div.
          $("#appendHere").append(newDiv); 
        }
    });



  });

})
